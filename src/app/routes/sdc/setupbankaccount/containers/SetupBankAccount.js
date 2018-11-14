import React from 'react'
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip'

import { userAuth } from '../../../../actions/auth';
import { financialActions } from '../../../../actions/sdc'
import { alertActions } from '../../../../actions/alert'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import { smallBox, bigBox, SmartMessageBox } from '../../../../components/utils/actions/MessageActions'
import UiValidate from '../../../../components/forms/validation/UiValidate'
import BootstrapValidator from '../../../../components/forms/validation/BootstrapValidator'
import DatatableBankAccount from '../../../../components/tables/DatatableBankAccount'

import { ScreenIDSetupBankAccount, PathBackEnd } from '../../../../../../settings'

const validatorOptions = {
  feedbackIcons: {
    // valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    bank_code: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The bank code is required'
        },
        stringLength: {
          max: 5,
          message: 'The bank code be less than 5 characters long'
        }
      }
    },
    bank_name: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The bank name is required'
        },
        stringLength: {
          max: 30,
          message: 'The bank name be less than 30 characters long'
        }
      }
    },
    bank_branch: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The bank branch is required'
        },
        stringLength: {
          max: 30,
          message: 'The bank branch be less than 30 characters long'
        }
      }
    },
    account_code: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The account code is required'
        },
        stringLength: {
          max: 30,
          message: 'The account code be less than 30 characters long'
        }
      }
    }
  }
};

class SetupBankAccount extends React.Component {
  constructor(props) {
    super(props);  

    if(this.state === undefined){
      const prm = {
        screen_id: ScreenIDSetupBankAccount,
      }      
      this.props.dispatch(userAuth.loadpage(prm));
    }  

    this.state = {
      bank_code: '',
      bank_name: '',
      bank_branch: '',
      account_code: '',
      submitted: false,
      screen_id: ScreenIDSetupBankAccount
    }
    
    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleAddSubmit = this.handleAddSubmit.bind(this)
  }

  handleAdd(e) {
    e.preventDefault();

    this.setState({ bank_code: '', bank_name: '', bank_branch: '', account_code: '', submitted: false });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddSubmit(e) {
    e.preventDefault();
    const { bank_code, bank_name, bank_branch, account_code, screen_id } = this.state;
    const { dispatch } = this.props;

    if (bank_code && bank_name && bank_branch) {
      this.setState({ submitted: true });

      const prm = {
        bank_code: bank_code,
        bank_name: bank_name,
        bank_branch: bank_branch,
        account_code: account_code,
        screen_id: screen_id,
      }
      dispatch(financialActions.addbankaccount(prm));

    }
  }

  render() {
    const { bank_code, bank_name, bank_branch, account_code, submitted, screen_id } = this.state;
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
                  {/* {modify.can_add == 'Y' &&
                      // <div className="widget-body-toolbar">
                      <div className="row">
                        <div className="col-xs-9 col-sm-5 col-md-5 col-lg-5">
                          <button onClick={this.handleAdd} className="btn btn-primary btn-sm" data-toggle="modal"
                            data-target="#myModalAdd">
                            <i className="fa fa-plus" /> <span className="hidden-mobile"> Add</span>
                          </button>
                        </div>
                        <div className="col-xs-3 col-sm-7 col-md-7 col-lg-7 text-right">
                        </div>
                      </div>
                      // </div>
                    } */}
                  <div className="widget-body no-padding">
                    <DatatableBankAccount
                      screen_id={screen_id}
                      screen_name={screen_name}
                      options={{
                        colReorder: true,
                        ajax: `${PathBackEnd}/api/bankaccountconfig`,
                        columns: [{ data: "BANK_CODE" }, { data: "BANK_NAME" }, { data: "BANK_BRANCH" }, { data: "ACCOUNT_CODE" },
                        {
                          searchable: false,
                          visible: (modify.can_edit == "Y" || modify.can_delete == "Y") ? true : false,
                          targets: -1,
                          data: null,
                          width: "6%",
                          //defaultContent: `<div class="btn-group">${(modify.can_edit == "Y") ? '<span class="glyphicon glyphicon-trash" /></button><button ID="btnEdit" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModalEdit"><span >Edit &nbsp;&nbsp;</span></button>' : ''}  ${(modify.can_delete == "Y") ? '<button ID="btnDelete" class="btn btn-danger btn-sm">Delete</button>' : ''}</div>`
                          defaultContent: `<div class="row">${(modify.can_edit == "Y") ? '<div data-toggle="tooltip" title="Edit" class = "col-md-2"><a id="btnEdit" data-toggle="modal" data-target="#myModalEdit" class="fa fa-fw fa-pencil-square-o" /></div>' : ''}${(modify.can_delete == "Y") ? '<div data-toggle="tooltip" title="Delete" class = "col-md-2"><a id="btnDelete" class="glyphicon glyphicon-trash " /></div>' : ''}</div>`
                        }],
                        buttons: [
                          {
                            text: `<span ><i class="fa fa-plus" /><span class="hidden-mobile"> Add</span></span>`,
                            className: `btn btn-primary btn-sm ${(modify.can_add == "Y") ? '' : 'hidden'}`,
                            action: function (e, dt, node, config) {
                              $("#myModalAdd").modal()
                              seft.setState({ bank_code: '', bank_name: '', bank_branch: '', account_code: '', submitted: false });
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
                            Bank Code
                              </th>
                          <th data-class="expand"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Bank Name
                            </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Bank Branch
                            </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Account Code
                            </th>
                          <th data-hide="user" className="text-right">
                          </th>
                        </tr>
                      </thead>
                    </DatatableBankAccount>
                  </div>
                </div>
                }
              </JarvisWidget>
            </article>
          </div>
        </WidgetGrid>

        {/* Modal Add */}
        <BootstrapValidator options={validatorOptions}>
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
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <label htmlFor="bank_code"> Bank Code</label><span class="text-danger">*</span>
                          <input type="text" name="bank_code" value={bank_code} onChange={this.handleChange} className="form-control" id="txtBankCode" placeholder="Bank Code" />
                        </div>
                        <div className="col-md-6 form-group">
                          <label htmlFor="bank_name"> Bank Name</label><span class="text-danger">*</span>
                          <input type="text" name="bank_name" value={bank_name} onChange={this.handleChange} className="form-control" id="txtBankName" placeholder="Bank Name" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <label htmlFor="bank_branch"> Bank Branch</label><span class="text-danger">*</span>
                          <input type="text" name="bank_branch" value={bank_branch} onChange={this.handleChange} className="form-control" id="txtBankBranch" placeholder="Bank Branch" />
                        </div>
                        <div className="col-md-6 form-group">
                          <label htmlFor="account_code"> Account Code</label><span class="text-danger">*</span>
                          <input type="text" name="account_code" value={account_code} onChange={this.handleChange} className="form-control" id="txtAccountCode" placeholder="Account Code" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" type="submit" className="btn btn-primary">
                      Save
                </button>
                    <button  type="button" className="btn btn-default" data-dismiss="modal">
                      Cancel
                </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </BootstrapValidator>
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

const connectedSetupBankAccount = connect(mapStateToProps)(SetupBankAccount);
export default connectedSetupBankAccount