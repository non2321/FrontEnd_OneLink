import React from 'react'
import { connect } from 'react-redux';
import { smallBox, bigBox, SmartMessageBox } from '../../components/utils/actions/MessageActions'

import BootstrapValidator from '../../components/forms/validation/BootstrapValidator'

import { financialActions } from '../../actions/sdc'
import _ from 'lodash'

import Delay from 'react-delay'

import { Async } from 'react-select';
import 'react-select/dist/react-select.css';

import { PathBackEnd } from '../../../../settings'

const Notuse = 'No Use'

const validatorOptions = {
  feedbackIcons: {
    // valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    formular_name: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The formular name is required'
        }
      }
    },
    account_code: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        // notEmpty: {
        //   message: 'The account code is required'
        // },
        stringLength: {
          max: 30,
          message: 'The account code be less than 30 characters long'
        }
      }
    },
    subledger_type: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        stringLength: {
          max: 30,
          message: 'The subledger type be less than 30 characters long'
        }
      }
    },
    subledger: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        stringLength: {
          max: 30,
          message: 'The subledger be less than 30 characters long'
        }
      }
    }
  }
};

const getOptionsBuType = () => {
  return fetch(`${PathBackEnd}/api/accountcodeconfigforsale/ddlbutype`)
    .then((response) => {
      return response.json();
    }).then((json) => {
      return { options: json };
    });
}

const getOptionsType = () => {
  return fetch(`${PathBackEnd}/api/accountcodeconfigforsale/ddltype`)
    .then((response) => {
      return response.json();
    }).then((json) => {
      return { options: json };
    });
}

class DatatableAccountCodeSetupForSale extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formular_id: '',
      formular_name: '',
      account_code: '',
      bu_type: '',
      type: '',
      subledger_type: '',
      subledger: '',
      screen_id: this.props.screen_id
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
  }

  handleChangesBuType = (bu_type) => {
    this.setState({ bu_type });
  }

  handleChangesType = (type) => {
    this.setState({ type });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleEditSubmit(e) {
    e.preventDefault()
    const { formular_id, formular_name, account_code, bu_type, type, subledger_type, subledger, fincode, screen_id } = this.state;
    const { dispatch } = this.props;

    if (formular_id && formular_name) {
      const prm = {
        formular_id: formular_id.toString(),
        formular_name: formular_name.toString(),
        account_code: (account_code.trim() == '' )? Notuse : account_code.toString(),
        bu_type: (bu_type)? bu_type.value.toString() : '',
        type: (type)? type.value.toString() : '',
        subledger_type: subledger_type.toString(),
        subledger: subledger.toString(),
        fincode: fincode.toString(),
        screen_id: screen_id
      }     
      dispatch(financialActions.editaccountforsale(prm));
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
      $('#edit-form').bootstrapValidator("resetForm", true);  
      
      self.setState({
        formular_id: data['FORMULARID'],
        formular_name: data['FORMULARNAME'],       
        account_code: data['ACCOUNTCODE'],
        bu_type: { value: data['BU_TYPE'], label: data['BU_TYPE'] },
        type: { value: data['TYPE'], label: data['TYPE'] },
        subledger_type: data['SUBLEDGERTYPE'],
        subledger: data['SUBLEDGER'],
      })
    })

  }

  render() {
    let { children, options, detailsFormat, paginationLength, ...props } = this.props;
    const { formular_id, formular_name, account_code, bu_type, type, subledger_type, subledger, fincode } = this.state;
    let itemaccount_code = ''
    if(account_code.trim() == Notuse) {
      this.setState({account_code: ''})
    }

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
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label htmlFor="formular_id">Formular ID</label>
                            <input type="text" name="formular_id" value={formular_id} onChange={this.handleChange} className="form-control" placeholder="Formular ID" disabled={true} />
                          </div>
                          <div className="col-md-6 form-group">
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label htmlFor="formular_name">Formular Name</label><span class="text-danger">*</span>
                            <input type="text" name="formular_name" value={formular_name} onChange={this.handleChange} className="form-control" placeholder="Formular Name" />
                          </div>
                          <div className="col-md-6 form-group">
                            <label htmlFor="account_code">Account Code</label>
                            <input type="text" name="account_code" value={account_code} onChange={this.handleChange} className="form-control" placeholder="No Use" />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label htmlFor="bu_type"> Bu Type</label>
                            <Delay wait={250} >
                              <Async
                                placeholder='Bu Type'
                                name="bu_type"
                                loadOptions={getOptionsBuType}
                                value={bu_type}
                                onChange={this.handleChangesBuType}
                              />
                            </Delay>
                          </div>
                          <div className="col-md-6 form-group">
                            <label htmlFor="type"> Type</label>
                            <Delay wait={500} >
                              <Async
                                placeholder='Type'
                                name="type"
                                loadOptions={getOptionsType}
                                value={type}
                                onChange={this.handleChangesType}
                              />
                            </Delay>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label htmlFor="subledger_type"> SubLedger Type</label>
                            <input type="text" name="subledger_type" value={subledger_type} onChange={this.handleChange} className="form-control" placeholder="SubLedger Type" />
                          </div>
                          <div className="col-md-6 form-group">
                            <label htmlFor="subledger"> SubLedger</label>
                            <input type="text" name="subledger" value={subledger} onChange={this.handleChange} className="form-control" placeholder="SubLedger" />
                          </div>
                        </div>
                        <div className="row">
                        <div className="col-md-6 form-group">
                          <label htmlFor="fincode"> Fin Code</label>
                          <input type="text" name="fincode" value={fincode} onChange={this.handleChange} className="form-control" placeholder="Fin Code" />
                        </div>
                        <div className="col-md-6 form-group">                         
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
      </BootstrapValidator>
    )
  }
}

const connectedDatatableAccountCodeSetupForSale = connect(null)(DatatableAccountCodeSetupForSale);
export default connectedDatatableAccountCodeSetupForSale