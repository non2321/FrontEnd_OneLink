import React from 'react'
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip'

import { userAuth } from '../../../../actions/auth';
import { inventoryActions } from '../../../../actions/sdc'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import DatatableAccountCodeForInventory from '../../../../components/tables/DatatableAccountCodeForInventory'

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

  componentDidMount() {
    const self = this
    let apiRequest1 = setTimeout(function () {
      fetch(`${PathBackEnd}/api/accountcodeforinventory/ddlgrp_by`)
        .then(response => response.json())
        .then(data => {
          self.setState({ optiongrp_by: data })
          return data
        });
    }, 400)
    let apiRequest2 = setTimeout(function () {
      fetch(`${PathBackEnd}/api/accountcodeforinventory/ddlcatcode`)
        .then(response => response.json())
        .then(data => {
          self.setState({ optioncat_code: data })
          return data
        });
    }, 600)
    let apiRequest3 = setTimeout(function () {
      fetch(`${PathBackEnd}/api/accountcodeforinventory/ddlacc_type`)
        .then(response => response.json())
        .then(data => {
          self.setState({ optionacc_type: data })
          return data
        });
    }, 800)
  }

  render() {
    const { action_code, inv_class, action, obj_account, subsidary, grp_by, cat_code, acc_type, doc_no, remark, submitted, screen_id } = this.state;
    const { optiongrp_by, optioncat_code, optionacc_type } = this.state
    const { erroraction_code, errorinv_class, erroraction, errorobj_account, errorsubsidary, errorgrp_by, errorcat_code, erroracc_type, errordoc_no, errorremark } = this.state
    const { modify, screen_name } = this.props;
    const seft = this

    return (
      <div id="content">
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12">
              <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                <header><h2>{screen_name}</h2></header>
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
        {modify &&
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
        }
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