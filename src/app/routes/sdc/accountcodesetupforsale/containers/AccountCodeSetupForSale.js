import React from 'react'
import { connect } from 'react-redux'

import { userAuth } from '../../../../actions/auth'
import { financialActions } from '../../../../actions/sdc'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'

import BootstrapValidator from '../../../../components/forms/validation/BootstrapValidator'
import DatatableAccountCodeSetupForSale from '../../../../components/tables/DatatableAccountCodeSetupForSale'

import { ScreenIDAccountCodeSetupForSale, PathBackEnd } from '../../../../../../settings'

import Delay from 'react-delay'

import { Async } from 'react-select';
import 'react-select/dist/react-select.css';

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

class AccountCodeSetupForSale extends React.Component {
  constructor(props) {
    super(props)

    if (this.state === undefined) {
      const prm = {
        screen_id: ScreenIDAccountCodeSetupForSale,
      }
      this.props.dispatch(userAuth.loadpage(prm))
    }

    this.state = {
      formular_name: '',
      account_code: '',
      bu_type: '',
      type: '',
      subledger_type: '',
      subledger: '',
      submitted: false,
      screen_id: ScreenIDAccountCodeSetupForSale
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAddSubmit = this.handleAddSubmit.bind(this)
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

  handleAddSubmit(e) {
    e.preventDefault();
    const { formular_name, account_code, bu_type, type, subledger_type, subledger, fincode, screen_id } = this.state;

    const { dispatch } = this.props;

    if (formular_name) {
      const prm = {
        formular_name: formular_name.toString(),
        account_code: account_code.toString(),
        bu_type: (bu_type.value) ? bu_type.value.toString() : '',
        type: (type.value) ? type.value.toString() : '',
        subledger_type: subledger_type.toString(),
        subledger: subledger.toString(),
        fincode: fincode.toString(),
        screen_id: screen_id
      }
      dispatch(financialActions.addaccountforsale(prm));
    }
  }

  render() {
    const { formular_name, account_code, bu_type, type, subledger_type, subledger, fincode, submitted, screen_id } = this.state;
    const { modify, screen_name } = this.props;
    const seft = this

    return (
      <div id="content">
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12">
              <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                <header><h2>{screen_name}</h2></header>
                {modify && <div>
                  <div className="widget-body no-padding">
                    <DatatableAccountCodeSetupForSale
                      screen_id={screen_id}
                      screen_name={screen_name}
                      options={{
                        colReorder: true,
                        ajax: `${PathBackEnd}/api/accountcodeconfigforsale`,
                        columns: [{ data: "FORMULARID" }, { data: "FORMULARNAME" }, { data: "ACCOUNTCODE" }, { data: "BU_TYPE" }, { data: "TYPE" }, { data: "SUBLEDGERTYPE" }, { data: "SUBLEDGER" }, { data: "FIN_CODE"},
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
                              seft.setState({ formular_name: '', account_code: '', bu_type: '', type: '', subledger_type: '', subledger: '', submitted: false });
                              // $('#add-form').bootstrapValidator('disableSubmitButtons', false)
                              $('#add-form').bootstrapValidator("resetForm", true);
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
                            Formular ID
                          </th>
                          <th data-class="expand"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Formular Name
                            </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Account Code
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            BU Type
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Type
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            SubLedge Type
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            SubLedge
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Fin Code
                          </th>
                          <th data-hide="user" className="text-right">
                          </th>
                        </tr>
                      </thead>
                    </DatatableAccountCodeSetupForSale>
                  </div>
                </div>
                }
              </JarvisWidget>
            </article>
          </div>
        </WidgetGrid>

        {/* Modal Add */}
        {modify && <BootstrapValidator options={validatorOptions}>
          <div className="modal fade" id="myModalAdd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
            aria-hidden="true">
            <form id="add-form" onSubmit={this.handleAddSubmit}>
              <div className="modal-dialog">
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
        </BootstrapValidator>
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

const connectedAccountCodeSetupForSale = connect(mapStateToProps)(AccountCodeSetupForSale);
export default connectedAccountCodeSetupForSale