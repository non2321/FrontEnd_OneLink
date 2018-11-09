import React from 'react'
import { connect } from 'react-redux';
import { smallBox, bigBox, SmartMessageBox } from '../../components/utils/actions/MessageActions'

import BootstrapValidator from '../../components/forms/validation/BootstrapValidator'

import { companyActions } from '../../actions/sdc'

import _ from 'lodash'

const validatorOptions = {
  feedbackIcons: {
    // valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    company_code: {
      // The group will be set as default (.form-group)
      validators: {
        notEmpty: {
          message: 'The company code is required'
        }
      }
    },
    company_name: {
      // The group will be set as default (.form-group)
      validators: {
        notEmpty: {
          message: 'The company name is required'
        }
      }
    },
    report_name: {
      // The group will be set as default (.form-group)
      validators: {
        notEmpty: {
          message: 'The report name is required'
        }
      }
    }
  }
};

class Datatable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      company_id: '',
      company_code: '',
      company_name: '',
      report_name: '',
      screen_id: this.props.screen_id
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleEditSubmit(e) {
    e.preventDefault()
    const { company_id, company_code, company_name, report_name, screen_id } = this.state;

    if (company_code && company_name && report_name) {
      this.setState({ submitted: true });
      const { dispatch } = this.props;
      if (company_id && company_code && company_name && report_name) {
        const prm = {
          company_id: company_id,
          company_code: company_code,
          company_name: company_name,
          report_name: report_name,
          screen_id: screen_id,
        }
        dispatch(companyActions.editcompanyaccount(prm));
      }
    }
  }

  componentDidMount() {
    System.import('script-loader!smartadmin-plugins/datatables-bundle/datatables.min.js').then(() => {
      this.datatable(this.props.data)
    })
    // setTimeout(function () { //Start the timer
    //   $('#table').DataTable().ajax.reload();
    // }.bind(this), 1000)
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

      $('#edit-form').bootstrapValidator("resetForm", true);  

      self.setState({ company_id: data['LOV_ID'] })
      self.setState({ company_code: data['LOV1'] })
      self.setState({ company_name: data['LOV2'] })
      self.setState({ report_name: data['LOV3'] })
    })


    element.on('click', 'tr #btnDelete', function () {
      let data = _dataTable.row($(this).parents('tr')).data()
      SmartMessageBox({
        title: `ลบข้อมูล ${data['LOV1']} `,
        content: `คุณแน่ใจหรือไม่ว่าต้องการลบ  ${data['LOV2']} `,
        buttons: '[No][Yes]'
      }, function (ButtonPressed) {
        if (ButtonPressed === "Yes") {
          const { screen_id } = self.state;
          const { dispatch } = self.props;

          if (data['LOV_ID']) {
            const prm = {
              company_id: data['LOV_ID'],
              screen_id: screen_id,
            }
            dispatch(companyActions.deletecompanyaccount(prm));
          }
        }
        if (ButtonPressed === "No") {
        }
      });
    });
  }

  render() {
    let { children, options, detailsFormat, paginationLength, modify, screen_id, screen_name, alert, dispatch, ...props } = this.props;
    const { company_id, company_code, company_name, report_name } = this.state;
    return (
      <BootstrapValidator options={validatorOptions}>
        <div>
          <table id="table" {...props} ref="table">
            {children}
          </table>
          <div>
            {/* Modal Edit */}
            <div className="modal fade" id="myModalEdit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
              aria-hidden="true">
              <form id="edit-form" onSubmit={this.handleEditSubmit}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                      </button>
                      <h4 className="modal-title" id="myModalLabel">Edit {this.props.screen_name}</h4>
                    </div>
                    <div className="modal-body">
                      <div class="form-group">
                        <div className="row hidden">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="ID"> Company Code</label>
                              <input type="text" className="form-control" id="txtIDEdit" name="company_id" value={company_id} onChange={this.handleChange} placeholder="ID" />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="Company Code"> Company Code</label><span class="text-danger">*</span>
                              <input type="text" className="form-control" id="txtComCodeEdit" name="company_code" disabled="disabled" value={company_code} onChange={this.handleChange} placeholder="Company Code" />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="Company Name"> Company Name</label><span class="text-danger">*</span>
                              <input type="text" className="form-control" id="txtComNameEdit" name="company_name" value={company_name} onChange={this.handleChange} placeholder="Company Name" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="Report Name"> Report Name</label><span class="text-danger">*</span>
                            <input type="text" name="report_name" value={report_name} onChange={this.handleChange} className="form-control" id="txtReportNameAdd" placeholder="Report Name"
                              data-bv-notempty="true"
                              data-bv-notempty-message="The report name is required and cannot be empty" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" type="submit" className="btn btn-primary">
                        Save
                </button>
                      {/* <button type="button" onClick={this._smartModEg1} className="btn btn-default" data-dismiss="modal"> */}
                      <button type="button" className="btn btn-default" data-dismiss="modal">
                        Cancel
                </button>
                    </div>
                  </div>
                  {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
              </form>
            </div>
            {/* /.modal */}
          </div>
        </div>
      </BootstrapValidator>
    )
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert
  };
}

const connectedDatatable = connect(mapStateToProps)(Datatable);
export default connectedDatatable