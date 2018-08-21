import React from 'react'
import { connect } from 'react-redux';

import { inventoryActions } from '../../actions/sdc'
import _ from 'lodash'


import Select from 'react-select'
import 'react-select/dist/react-select.css';

import { PathBackEnd } from '../../../../settings'


class DatatableAccountCodeForInventory extends React.Component {
  constructor(props) {
    super(props)
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
      screen_id: this.props.screen_id
    };

    //Set Dropdown
    this.setState({
      optiongrp_by: this.props.optiongrp_by,
      optioncat_code: this.props.optiongrp_by,
      optionacc_type: this.props.optionacc_type
    })

    this.handleChange = this.handleChange.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
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

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleEditSubmit(e) {
    e.preventDefault()
    const { action_code, inv_class, action, obj_account, subsidary, grp_by, cat_code, acc_type, doc_no, remark, screen_id } = this.state
    const { dispatch } = this.props;

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
      dispatch(inventoryActions.editaccountcodeforinventory(prm))      
    }
  }

  componentDidMount() {
    System.import('script-loader!smartadmin-plugins/datatables-bundle/datatables.min.js').then(() => {
      this.datatable(this.props.data)
    })
  }

  datatable() {
    const self = this;
    const element = $(this.refs.table);
    let { options } = { ...this.props } || {}


    let toolbar = '';
    if (options.buttons)
      toolbar += 'B';
    if (this.props.paginationLength)
      toolbar += 'l';
    if (this.props.columnsHide)
      toolbar += 'C';

    if (typeof options.ajax === 'string') {
      let url = options.ajax;
      options.ajax = {
        url: url,
        complete: function (xhr) {
          // AjaxActions.contentLoaded(xhr)
        }
      }
    }

    options = _.extend(options, {
      "dom": "<'dt-toolbar'<'col-xs-12 col-sm-8' B><'pull-right hidden-xs' l><'pull-right' f>r >" +
        "t" +
        "<'dt-toolbar-footer' <'col-sm-6 col-xs-12 hidden-xs'i>p<'col-xs-12 col-sm-6'>>",
      oLanguage: {
        "sSearch": "<span class='input-group-addon input-sm'><i class='glyphicon glyphicon-search'></i></span> ",
        "sLengthMenu": "_MENU_"
      },
      "autoWidth": false,
      retrieve: true,
      responsive: true
    });

    const _dataTable = element.DataTable(options);

    if (this.props.filter) {
      // Apply the filter
      element.on('keyup change', 'thead th input[type=text]', function () {
        _dataTable
          .column($(this).parent().index() + ':visible')
          .search(this.value)
          .draw();

      });
    }

    if (!toolbar) {
      element.parent().find(".dt-toolbar").append('<div class="text-right"><img src="assets/img/logo.png" alt="SmartAdmin" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>');
    }

    if (this.props.detailsFormat) {
      const format = this.props.detailsFormat;
      element.on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = _dataTable.row(tr);
        if (row.child.isShown()) {
          row.child.hide();
          tr.removeClass('shown');
        }
        else {
          row.child(format(row.data())).show();
          tr.addClass('shown');
        }
      })
    }

    element.on('click', 'th', function () {
      $('#table').DataTable().ajax.reload();
    })


    element.on('click', 'tr #btnEdit', function () {
      let data = _dataTable.row($(this).parents('tr')).data()

      self.setState({
        action_code: data['ACTIONCODE'],
        inv_class: data['INV_CLASS'],
        action: data['ACTION'],
        obj_account: data['OBJACCOUT'],
        subsidary: data['SUBSIDARY'],
        grp_by: { value: data['GRPBY'], label: data['GRPBY'] },
        cat_code: { value: data['CATCODE'], label: data['CATCODE'] },
        acc_type: { value: data['ACCTYPE'], label: data['ACCTYPE'] },
        doc_no: data['DOCNO'],
        remark: data['REMARK']
      })
    })
  }

  render() {
    let { children, options, detailsFormat, paginationLength, screen_name, screen_id, dispatch, optiongrp_by, optioncat_code, optionacc_type, ...props } = this.props;
    const { action_code, inv_class, action, obj_account, subsidary, grp_by, cat_code, acc_type, doc_no, remark } = this.state
    const { erroraction_code, errorinv_class, erroraction, errorobj_account, errorsubsidary, errorgrp_by, errorcat_code, erroracc_type, errordoc_no, errorremark } = this.state

    return (
      <div>
        <table id="table" {...props} ref="table">
          {children}
        </table>
        <div>
          {/* Modal Edit */}
          <div className="modal fade" id="myModalEdit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
            aria-hidden="true">
            <form id="edit-form" onSubmit={this.handleEditSubmit}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                      &times;
                      </button>
                    <h4 className="modal-title" id="myModalLabel">Edit {this.props.screen_name}</h4>
                  </div>
                  <div className="modal-body">
                    <div class="form-group">
                      <div className="row">
                        <div className="col-md-4 form-group">
                          <label htmlFor="action_code"> Action Code</label><span class="text-danger">*</span>
                          <input type="number" name="action_code" value={action_code} onChange={this.handleChange} className="form-control" placeholder="Action Code" disabled={true} />
                          <span className="text-danger">{erroraction_code}</span>
                        </div>
                        <div className="col-md-4 form-group">
                          <label htmlFor="inv_class"> Inv Class</label><span class="text-danger">*</span>
                          <input type="text" name="inv_class" value={inv_class} onChange={this.handleChange} className="form-control" placeholder="Inv Class" disabled={true} />
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
                            <Select options={optiongrp_by} placeholder='GrpBy' name="grp_by" value={grp_by.value} onChange={this.handleChangesGrp_by} />
                          }
                          <span className="text-danger">{errorgrp_by}</span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4 form-group">
                          <label htmlFor="cat_code"> CatCode</label><span class="text-danger">*</span>
                          {optioncat_code &&
                            <Select options={optioncat_code} placeholder='CatCode' name="cat_code" value={cat_code.value} onChange={this.handleChangesCat_code} />
                          }
                          <span className="text-danger">{errorcat_code}</span>
                        </div>
                        <div className="col-md-4 form-group">
                          <label htmlFor="acc_type"> Acc Type</label><span class="text-danger">*</span>
                          {optionacc_type &&
                            <Select options={optionacc_type} placeholder='Acc Type' name="acc_type" value={acc_type.value} onChange={this.handleChangesAcc_type} disabled={true} />
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
        </div>
      </div>
    )
  }
}

const connectedDatatableAccountCodeForInventory = connect(null)(DatatableAccountCodeForInventory);
export default connectedDatatableAccountCodeForInventory