import React from 'react'
import { connect } from 'react-redux';
import XLSX from 'xlsx';

import { userAuth } from '../../../../actions/auth';
import { inventoryActions } from '../../../../actions/sdc'
import { alertActions } from '../../../../actions/alert/alert.actions'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import DatatableAccountCodeForInventory from '../../../../components/tables/DatatableAccountCodeForInventory'
import PopupBankInAdjustmentUpload from '../../../../components/tables-popup/PopupBankInAdjustmentUpload'

import { ScreenIDAccountCodeForInventory, PathBackEnd } from '../../../../../../settings'

import Select from 'react-select'
import 'react-select/dist/react-select.css';

import './AccountCodeForInventory.css'

class AccountCodeForInventory extends React.Component {
  constructor(props) {
    super(props)

    if (this.state === undefined) {
      const prm = {
        screen_id: ScreenIDAccountCodeForInventory,
      }
      this.props.dispatch(userAuth.loadpage(prm))
    }

    this.state = {
      action_code: '',
      inv_class: '',
      action: '',
      obj_account: '',
      subsidary: '',
      grp_by: '',
      cat_code: '',
      acc_type: '',
      doc_no: '',
      remark: '',
      submitted: false,
      screen_id: ScreenIDAccountCodeForInventory
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAddSubmit = this.handleAddSubmit.bind(this)

    this.onChangeFile = this.onChangeFile.bind(this)
    this.handleDownloadTemplate = this.handleDownloadTemplate.bind(this)

    this.handleUpload = this.handleUpload.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddSubmit(e) {
    e.preventDefault()
    const { action_code, inv_class, action, obj_account, subsidary, grp_by, cat_code, acc_type, doc_no, remark, screen_id } = this.state
    const { dispatch } = this.props
    const self = this

    this.setState({
      erroraction_code: (action_code) ? '' : 'The action code is required',
      errorinv_class: (inv_class) ? (inv_class.length <= 10) ? '' : 'The inv class be less than 10 characters long' : 'The inv class is required',
      erroraction: (action) ? '' : 'The action is required',
      errorobj_account: (obj_account) ? '' : 'The obj account is required',
      errorsubsidary: (subsidary) ? '' : 'The subsidary is required',
      errorsubsidary: (subsidary) ? '' : 'The subsidary is required',
      errorgrp_by: (grp_by) ? '' : 'The grpby is required',
      errorcat_code: (cat_code) ? '' : 'The catcode is required',
      erroracc_type: (acc_type) ? '' : 'The acc type is required',
      errordoc_no: (doc_no) ? '' : 'The doc no. is required',
      errorremark: (remark) ? (remark.length <= 500) ? '' : 'The remark be less than 500 characters long' : 'The remark is required',
      submitted: false
    })


    if (action_code && inv_class && inv_class.length <= 10 && action && obj_account && subsidary && grp_by && cat_code && acc_type && doc_no && remark && remark.length <= 500) {
      const prm = {
        action_code: action_code,
        inv_class: inv_class,
        action: action,
        obj_account: obj_account,
        subsidary: subsidary,
        grp_by: (grp_by.value) ? grp_by.value.toString() : '',
        cat_code: (cat_code.value) ? cat_code.value.toString() : '',
        acc_type: (acc_type.value) ? acc_type.value.toString() : '',
        doc_no: doc_no,
        remark: remark,
        screen_id: screen_id
      }
      dispatch(inventoryActions.addaccountcodeforinventory(prm))
      setTimeout(function () {
        self.setState({ submitted: true })
      }, 500)
    }
  }

  handleChangesGrp_by = (grp_by) => {
    this.setState({
      grp_by: (grp_by == null) ? '' : grp_by
    });
  }

  handleChangesCat_code = (cat_code) => {
    this.setState({
      cat_code: (cat_code == null) ? '' : cat_code
    });
  }

  handleChangesAcc_type = (acc_type) => {
    this.setState({
      acc_type: (acc_type == null) ? '' : acc_type
    });
  }

  onChangeFile(e) {
    e.preventDefault()

    const self = this
    this.setState({ uploading: true })
    if (e.target.files.length > 0) {
      let namelength = e.target.files[0].name.length
      let name = ''
      if (namelength > 40) {
        name = `${e.target.files[0].name.substr(0, 40)}...`
      } else {
        name = e.target.files[0].name
      }
      this.setState({ file: e.target.files[0], filename: name })

      let files = e.target.files, file;
      if (!files || files.length == 0) return;
      file = files[0];
      let fileReader = new FileReader();

      let objectitem = []
      let tempdata
      fileReader.onload = function (e) {

        // call 'xlsx' to read the file
        let workbook = XLSX.read(e.target.result, { type: 'buffer' });

        let sheet_name_list = workbook.SheetNames;

        sheet_name_list.forEach(function (y) { /* iterate through sheets */
          let worksheet = workbook.Sheets[y];
          worksheet['!ref'] = "A2:Z10000"
          let tempitem = XLSX.utils.sheet_to_json(worksheet)

          for (let item of tempitem) {
            tempdata = {}
            tempdata['Action Code'] = (item['Action Code']) ? item['Action Code'] : ''
            tempdata['Inv Class'] = (item['Inv Class']) ? item['Inv Class'] : ''
            tempdata['Action'] = (item['Action']) ? item['Action'] : ''
            tempdata['Obj Account'] = (item['Obj Account']) ? item['Obj Account'] : ''
            tempdata['Subsidary'] = (item['Subsidary']) ? item['Subsidary'] : ''
            tempdata['GrpBy'] = (item['GrpBy']) ? item['GrpBy'] : ''
            tempdata['CatCode'] = (item['CatCode']) ? item['CatCode'] : ''
            tempdata['Acc Type'] = (item['Acc Type']) ? item['Acc Type'] : ''
            tempdata['Doc No'] = (item['Doc No']) ? item['Doc No'] : ''
            tempdata['Remark'] = (item['Remark']) ? item['Remark'] : ''
            objectitem.push(tempdata)
          }
        })
        let checkColumn = true
        if (objectitem.length > 0) {

          if (objectitem[0]['Action Code'] === '') checkColumn = false
          if (objectitem[0]['Inv Class'] === '') checkColumn = false
          if (objectitem[0]['Action'] === '') checkColumn = false
          if (objectitem[0]['Obj Account'] === '') checkColumn = false
          if (objectitem[0]['Subsidary'] === '') checkColumn = false
          if (objectitem[0]['GrpBy'] === '') checkColumn = false
          if (objectitem[0]['CatCode'] === '') checkColumn = false
          if (objectitem[0]['Acc Type'] === '') checkColumn = false
          if (objectitem[0]['Doc No'] === '') checkColumn = false
          if (objectitem[0]['Remark'] === '') checkColumn = false

          if (checkColumn == true) {
            for (let item in objectitem) {
              objectitem[item]['Status'] = ''
            }

            let data = {
              "aaData": objectitem
            }
            self.setState({ uploading: false, upload: data, obj: objectitem })
          } else {

            self.setState({ file: null, filename: 'Choose a file...', uploading: false, upload: null, obj: null })
            self.props.dispatch(alertActions.error("File incorrect."))
          }
        } else {
          self.setState({ file: null, filename: 'Choose a file...', uploading: false, upload: null, obj: null })
          self.props.dispatch(alertActions.warning("Data not found."))
        }

      }
      fileReader.readAsArrayBuffer(file)
      e.target.value = '';
    }
  }

  handleUpload(e) {
    e.preventDefault
    const self = this
    const { dispatch } = this.props
    const { screen_id, obj, optionacc_type, optioncat_code, optiongrp_by, validation } = this.state
    let objectitem = []
    let tempdata

    this.setState({ uploading: true })
    setTimeout(() => {
      if (obj && screen_id) {

        let statusall = true

        for (let item in obj) {

          obj[item]['Status'] = 'Success'
          let status = true

          if (obj[item]['Action Code'].trim() == '') status = false
          if (obj[item]['Inv Class'].trim() == '') status = false
          if (obj[item]['Action'].trim() == '') status = false
          if (obj[item]['Obj Account'].trim() == '') status = false
          if (obj[item]['Subsidary'].trim() == '') status = false
          if (obj[item]['GrpBy'].trim() == '') status = false
          if (obj[0]['CatCode'] === '') checkColumn = false
          if (obj[0]['Acc Type'] === '') checkColumn = false
          if (obj[0]['Doc No'] === '') checkColumn = false
          if (obj[0]['Remark'] === '') checkColumn = false

          const valgrp_by = optiongrp_by.find((x) => { return (x.label.toString().trim() == obj[0]['GrpBy'].trim()) })
          if (valgrp_by == undefined) status = false

          const valcat_code = optioncat_code.find((x) => { return (x.label.toString().trim() == obj[0]['CatCode'].trim()) })
          if (valcat_code == undefined) status = false

          const valacc_type = optionacc_type.find((x) => { return (x.label.toString().trim() == obj[0]['Acc Type'].trim()) })
          if (valacc_type == undefined) status = false

          if (valacc_type) {
            const valinvitem = validation.find((x) => { return (x.ACTIONCODE.toString().trim() == obj[item]['Action Code'].trim() && x.INV_CLASS.toString().trim() == obj[item]['Inv Class'].trim() && x.ACCTYPE.toString().trim() == valacc_type.value) })
            if (valinvitem) status = false
          }

          if (status == true) {
            obj[item]['Status'] = 'Success'
          } else {
            obj[item]['Status'] = 'Fail'
            statusall = false
          }
        }

        let data = {
          "aaData": obj
        }

        if (statusall == true) {
          for (let item of obj) {
            tempdata = {}
            tempdata['Action Code'] = (item['Action Code']) ? item['Action Code'] : ''
            tempdata['Inv Class'] = (item['Inv Class']) ? item['Inv Class'] : ''
            tempdata['Action'] = (item['Action']) ? item['Action'] : ''
            tempdata['Obj Account'] = (item['Obj Account']) ? item['Obj Account'] : ''
            tempdata['Subsidary'] = (item['Subsidary']) ? item['Subsidary'] : ''
            tempdata['Doc No'] = (item['Doc No']) ? item['Doc No'] : ''
            tempdata['Remark'] = (item['Remark']) ? item['Remark'] : ''

            const valgrp_by = optiongrp_by.find((x) => { return (x.label.toString().trim() == item['GrpBy'].trim()) })
            if (valgrp_by) {
              tempdata['GrpBy'] = valgrp_by.value
            } else {
              tempdata['GrpBy'] = ''
            }

            const valcat_code = optioncat_code.find((x) => { return (x.label.toString().trim() == item['CatCode'].trim()) })
            if (valcat_code) {
              tempdata['CatCode'] = valcat_code.value
            } else {
              tempdata['CatCode'] = ''
            }

            const valacc_type = optionacc_type.find((x) => { return (x.label.toString().trim() == item['Acc Type'].trim()) })
            if (valacc_type) {
              tempdata['Acc Type'] = valacc_type.value
            } else {
              tempdata['Acc Type'] = ''
            }
            objectitem.push(tempdata)
          }
          dispatch(inventoryActions.importaccountcodeforinventory(objectitem, screen_id));
          self.setState({ uploading: false, upload: data, obj: null })

          setTimeout(async () => {
            let response = await fetch(`${PathBackEnd}/api/accountcodeforinventoryvalidation`)
            let json = await response.json()
            this.setState({
              validation: json
            })
          }, 500)

        } else {
          self.setState({ uploading: false, upload: data, obj: null })
        }
      }
    }, 100)
  }

  handleDownloadTemplate(e) {
    e.preventDefault()
    inventoryActions.downloadtemplateaccountcodeforinventory();
  }

  handleImport = () => {
    this.setState({
      filename: '',
      obj: null,
      upload: null
    })
  }

  async componentDidMount() {

    setTimeout(async () => {
      let response = await fetch(`${PathBackEnd}/api/accountcodeforinventory/ddlacc_type`)
      let json = await response.json()
      this.setState({
        optionacc_type: json
      })
    }, 800)

    setTimeout(async () => {
      let response = await fetch(`${PathBackEnd}/api/accountcodeforinventory/ddlcatcode`)
      let json = await response.json()
      this.setState({
        optioncat_code: json
      })
    }, 400)

    setTimeout(async () => {
      let response = await fetch(`${PathBackEnd}/api/accountcodeforinventory/ddlgrp_by`)
      let json = await response.json()
      this.setState({
        optiongrp_by: json
      })
    }, 600)

    setTimeout(async () => {
      let response = await fetch(`${PathBackEnd}/api/accountcodeforinventoryvalidation`)
      let json = await response.json()
      this.setState({
        validation: json
      })
    }, 1500)
  }

  render() {
    const { action_code, inv_class, action, obj_account, subsidary, grp_by, cat_code, acc_type, doc_no, remark, submitted, screen_id } = this.state;
    const { optiongrp_by, optioncat_code, optionacc_type } = this.state
    const { erroraction_code, errorinv_class, erroraction, errorobj_account, errorsubsidary, errorgrp_by, errorcat_code, erroracc_type, errordoc_no, errorremark } = this.state
    const { filename, uploading, upload, obj } = this.state
    const { modify, screen_name } = this.props;
    const seft = this

    return (
      <div id="content">
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12">
              <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                <header><h2>{screen_name}</h2>
                  {modify && modify.can_edit == "Y" && <div className="jarviswidget-ctrls" >
                    <a style={{ "padding-left": "10px", "padding-right": "10px" }} onClick={this.handleImport} title="Import" className="button-icon form-group" data-toggle="modal" data-target="#myModalUpload">
                      <span > Import</span></a>

                  </div>
                  }
                </header>
                {modify && optionacc_type && <div>
                  <div className="widget-body no-padding">
                    <DatatableAccountCodeForInventory
                      screen_id={screen_id}
                      screen_name={screen_name}
                      optiongrp_by={optiongrp_by}
                      optioncat_code={optioncat_code}
                      optionacc_type={optionacc_type}
                      options={{
                        colReorder: true,
                        ajax: `${PathBackEnd}/api/accountcodeforinventory`,
                        columns: [{ data: "ACTIONCODE", "width": "10%" }, { data: "INV_CLASS", "width": "8%" }, { data: "ACTION", "width": "12%" }, { data: "OBJACCOUT", "width": "10%" }, { data: "SUBSIDARY", "width": "8%" }, { data: "GRPBY_DESC", "width": "12%" }, { data: "CATCODE_DESC", "width": "12%" }, { data: "ACCTYPE", "width": "8%" }, { data: "DOCNO", "width": "7%" },
                        {
                          "mData": "REMARK",
                          "mRender": function (data, type, full) {

                            // return '<span data-toggle="tooltip" title="' + data + '" class="tooltiptext">' + (data.length > 30)?data.substr( 0,20 ) + '...': data; + '</span>'; 
                            const datasub = (data.length > 17) ? data.substr(0, 17) + '...' : data
                            return '<span data-toggle="tooltip" title="' + data + '" class="tooltiptext">' + datasub + '</span>';
                          }
                        },
                        {
                          searchable: false,
                          visible: (modify.can_edit == "Y" || modify.can_delete == "Y") ? true : false,
                          targets: -1,
                          data: null,
                          width: "3%",
                          defaultContent: `<div class="row">${(modify.can_edit == "Y") ? '<div data-toggle="tooltip" title="Edit" class = "col-md-2"><a id="btnEdit" data-toggle="modal" data-target="#myModalEdit" class="fa fa-fw fa-pencil-square-o" /></div>' : ''}</div>`
                        }],
                        buttons: [
                          {
                            text: `<span ><i class="fa fa-plus" /><span class="hidden-mobile"> Add</span></span>`,
                            className: `btn btn-primary btn-sm ${(modify.can_add == "Y") ? '' : 'hidden'}`,
                            action: function (e, dt, node, config) {
                              $("#myModalAdd").modal()
                              seft.setState({ action_code: '', inv_class: '', action: '', obj_account: '', subsidary: '', grp_by: '', cat_code: '', acc_type: '', doc_no: '', remark: '', submitted: false });
                            }
                          },
                        ],
                      }}
                      paginationLength={true} className="table table-striped table-bordered table-hover"
                      width="100%">
                      <thead>
                        <tr>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Action Code
                          </th>
                          <th data-class="expand"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Inv Class
                            </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Action
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Obj Account
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Subsidary
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            GrpBy
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            CatCode
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Acc Type
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Doc No.
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Remark
                          </th>
                          <th data-hide="user" className="text-right">
                          </th>
                        </tr>
                      </thead>
                    </DatatableAccountCodeForInventory>
                  </div>
                </div>
                }
              </JarvisWidget>
            </article>
          </div>
        </WidgetGrid>

        {/* Modal Add */}

        <div className="modal fade" id="myModalAdd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <form id="add-form" onSubmit={this.handleAddSubmit}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                    &times;
                      </button>
                  <h4 className="modal-title" id="myModalLabel">Add {screen_name}</h4>
                </div>
                <div className="modal-body">
                  <div class="form-group">
                    <div className="row">
                      <div className="col-md-4 form-group">
                        <label htmlFor="action_code"> Action Code</label><span class="text-danger">*</span>
                        <input type="number" name="action_code" value={action_code} onChange={this.handleChange} className="form-control" placeholder="Action Code" />
                        <span className="text-danger">{erroraction_code}</span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label htmlFor="inv_class"> Inv Class</label><span class="text-danger">*</span>
                        <input type="text" name="inv_class" value={inv_class} onChange={this.handleChange} className="form-control" placeholder="Inv Class" />
                        <span className="text-danger">{errorinv_class}</span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label htmlFor="action"> Action</label><span class="text-danger">*</span>
                        <input type="text" name="action" value={action} onChange={this.handleChange} className="form-control" placeholder="Action" />
                        <span className="text-danger">{erroraction}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 form-group">
                        <label htmlFor="obj_account"> Obj Account</label><span class="text-danger">*</span>
                        <input type="text" name="obj_account" value={obj_account} onChange={this.handleChange} className="form-control" placeholder="Obj Account" />
                        <span className="text-danger">{errorobj_account}</span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label htmlFor="subsidary"> Subsidary</label><span class="text-danger">*</span>
                        <input type="text" name="subsidary" value={subsidary} onChange={this.handleChange} className="form-control" placeholder="Subsidary" />
                        <span className="text-danger">{errorsubsidary}</span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label htmlFor="grp_by"> GrpBy</label><span class="text-danger">*</span>
                        {optiongrp_by &&
                          <Select options={optiongrp_by} placeholder='GrpBy' name="grp_by" value={grp_by} onChange={this.handleChangesGrp_by} />
                        }
                        <span className="text-danger">{errorgrp_by}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 form-group">
                        <label htmlFor="cat_code"> CatCode</label><span class="text-danger">*</span>
                        {optioncat_code &&
                          <Select options={optioncat_code} placeholder='CatCode' name="cat_code" value={cat_code} onChange={this.handleChangesCat_code} />
                        }
                        <span className="text-danger">{errorcat_code}</span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label htmlFor="acc_type"> Acc Type</label><span class="text-danger">*</span>
                        {optionacc_type &&
                          <Select options={optionacc_type} placeholder='Acc Type' name="acc_type" value={acc_type} onChange={this.handleChangesAcc_type} />
                        }
                        <span className="text-danger">{erroracc_type}</span>
                      </div>
                      <div className="col-md-4 form-group">
                        <label htmlFor="doc_no"> Doc No.</label><span class="text-danger">*</span>
                        <input type="text" name="doc_no" value={doc_no} onChange={this.handleChange} className="form-control" placeholder="Doc No." />
                        <span className="text-danger">{errordoc_no}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8 form-group">
                        <label htmlFor="remark"> Remark</label><span class="text-danger">*</span>
                        <textarea name="remark" value={remark} onChange={this.handleChange} class="form-control" placeholder="Remark" rows="3"></textarea>
                        <span className="text-danger">{errorremark}</span>
                      </div>
                      <div className="col-md-4 form-group">
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" type="submit" className="btn btn-primary">
                    Save
                    </button>
                  <button type="button" className="btn btn-default" data-dismiss="modal">
                    Cancel
                    </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Upload */}
        <div className="modal fade" id="myModalUpload" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <div className="modal-dialog" style={{ width: 1100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                  &times;
                                            </button>
                <h4 className="modal-title" id="myModalLabel">Upload Excel</h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-3 form-group">
                      <label > Download Template</label>
                    </div>
                    <div className="col-md-9 form-group">
                      <button type="button" className="btn btn-primary btn-sm " onClick={this.handleDownloadTemplate}>
                        Download
                                                    </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 form-group">
                      <label > Import Excel</label>
                    </div>
                    <div className="col-md-9 form-group">
                      <input id="fileInput" type="file" name="file-1" id="file-1" class="inputfile inputfile-1" onChange={this.onChangeFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                      <label for="file-1" className="btn btn-primary btn-sm ">
                        &nbsp;Browse&nbsp;&nbsp;
                                                    </label>
                      <label >&nbsp;{filename}</label>
                      {uploading &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="no-padding">
                {upload && uploading == false &&
                  <PopupBankInAdjustmentUpload
                    options={{
                      colReorder: true,
                      ajax: function (data, callback, settings) {
                        callback(
                          upload
                        )
                      },
                      columns: [{ data: "Action Code", "width": "6%" }, { data: "Inv Class", "width": "6%" }, { data: "Action", "width": "6%" }, { data: "Obj Account", "width": "6%" }, { data: "Subsidary", "width": "6%" }, { data: "GrpBy", "width": "6%" }, { data: "CatCode", "width": "6%" }, { data: "Acc Type", "width": "6%" }, { data: "Doc No", "width": "6%" }, { data: "Remark", "width": "6%" }, { data: "Status", "width": "6%" }
                      ],
                    }}
                    paginationLength={true} className="table table-striped table-bordered table-hover"
                    width="100%">
                    <thead>
                      <tr>
                        <th data-hide="user"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Action Code
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Inv Class
                                                    </th>
                        <th data-hide="user"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Action
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Obj Account
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Subsidary
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          GrpBy
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          CatCode
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Acc Type
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Doc No
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Remark
                                                    </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Status
                                                    </th>
                      </tr>
                    </thead>
                  </PopupBankInAdjustmentUpload>
                }
              </div>
              <div className="modal-footer">
                <button type="button" type="submit" className="btn btn-primary" disabled={!obj} onClick={this.handleUpload}>
                  Upload
                                        </button>
                <button type="button" className="btn btn-default" data-dismiss="modal">
                  Close
                                        </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  const { loadpage } = state;
  const screen_name = loadpage.screen_name
  const modify = loadpage.modify
  return {
    modify,
    screen_name
  };
}

const connectedAccountCodeForInventory = connect(mapStateToProps)(AccountCodeForInventory);
export default connectedAccountCodeForInventory