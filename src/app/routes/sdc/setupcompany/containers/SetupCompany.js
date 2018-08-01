import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../actions/auth';
import { companyActions } from '../../../../actions/sdc'
import { alertActions } from '../../../../actions/alert'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import { smallBox, bigBox, SmartMessageBox } from '../../../../components/utils/actions/MessageActions'
import UiValidate from '../../../../components/forms/validation/UiValidate'
import BootstrapValidator from '../../../../components/forms/validation/BootstrapValidator'
import Datatable from '../../../../components/tables/Datatable'

import { ScreenIDSetupCompany, PathBackEnd } from '../../../../../../settings'

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
        },
        stringLength: {
          max: 200,
          message: 'The company code be less than 200 characters long'
        }
      }
    },
    company_name: {
      // The group will be set as default (.form-group)
      validators: {
        notEmpty: {
          message: 'The company name is required'
        },
        stringLength: {
          max: 200,
          message: 'The company name be less than 200 characters long'
        }
      }
    }
  }
};


class SetupCompany extends React.Component {
  constructor(props) {
    super(props);

    if(this.state === undefined){
      const prm = {
        screen_id: ScreenIDSetupCompany,
      }
      this.props.dispatch(userAuth.loadpage(prm))
    }  

    this.state = {
      company_code: '',
      company_name: '',
      submitted: true,
      screen_id: ScreenIDSetupCompany
    }    

    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleAddSubmit = this.handleAddSubmit.bind(this)
  }

  handleAdd(e) {
    e.preventDefault();
    this.setState({ company_id: '', company_code: '', company_name: '', submitted: false });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddSubmit(e) {
    e.preventDefault();
    const { company_code, company_name, screen_id } = this.state;
    if (company_code && company_name) {
      this.setState({ submitted: true });

      const { dispatch } = this.props;
      if (company_code && company_name) {
        const prm = {
          company_code: company_code,
          company_name: company_name,
          screen_id: screen_id,
        }
        dispatch(companyActions.addcompany(prm));
      }
    }
  }



  render() {
    const { company_id, company_code, company_name, submitted, screen_id } = this.state;
    const { modify, screen_name } = this.props;
    const seft = this
    return (
      <div id="content" >
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12">
              <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                <header><h2>{screen_name}</h2></header>
                {modify && <div>
                  {/* {modify.can_add == 'Y' &&
                      <div className="widget-body-toolbar">
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
                      </div>
                    } */}
                  <div className="widget-body no-padding">
                    <Datatable
                      screen_id={screen_id}
                      screen_name={screen_name}
                      options={{
                        colReorder: true,
                        ajax: `${PathBackEnd}/api/companyconfig`,
                        columns: [{ data: "LOV_ID", "visible": false, searchable: false }, { data: "LOV1" }, { data: "LOV2" },
                        {
                          searchable: false,
                          visible: (modify.can_edit == "Y" || modify.can_delete == "Y") ? true : false,
                          targets: -1,
                          data: null,
                          width: "6%",
                          //defaultContent: `<div class="btn-group">${(modify.can_edit == "Y") ? '<button ID="btnEdit" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModalEdit"><span >Edit &nbsp;&nbsp;</span></button>' : ''}  ${(modify.can_delete == "Y") ? '<button ID="btnDelete" class="btn btn-danger btn-sm">Delete</button>' : ''}</div>`
                          defaultContent: `<div class="row">${(modify.can_edit == "Y") ? '<div data-toggle="tooltip" title="Edit" class = "col-md-2"><a id="btnEdit" data-toggle="modal" data-target="#myModalEdit" class="fa fa-fw fa-pencil-square-o" /></div>' : ''}${(modify.can_delete == "Y") ? '<div data-toggle="tooltip" title="Delete" class = "col-md-2"><a id="btnDelete" class="glyphicon glyphicon-trash " /></div>' : ''}</div>`
                        }],
                        buttons: [
                          {
                            text: `<span ><i class="fa fa-plus" /><span class="hidden-mobile"> Add</span></span>`,
                            className: `btn btn-primary btn-sm ${(modify.can_add == "Y") ? '' : 'hidden'}`,
                            action: function (e, dt, node, config) {
                              $("#myModalAdd").modal()
                              seft.setState({ company_id: '', company_code: '', company_name: '', submitted: false });
                              $('#add-form').bootstrapValidator("resetForm", true);         
                            }
                          },
                        ],
                      }}
                      paginationLength={true} className="table table-striped table-bordered table-hover"
                      width="100%">
                      <thead>
                        <tr>
                          <th data-hide="user">ID</th>
                          <th data-class="expand"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            CompanyCode
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            CompanyName
                          </th>
                          <th data-hide="user" className="text-right">
                            {/* <i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs" />
                          Button */}
                          </th>
                        </tr>
                      </thead>
                    </Datatable>
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
                    <div class="form-group">                      
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="Company Code"> Company Code</label><span class="text-danger">*</span>
                            <input type="text" name="company_code" value={company_code} onChange={this.handleChange} className="form-control" id="txtComCodeAdd" placeholder="Company Code" />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="Company Name"> Company Name</label><span class="text-danger">*</span>
                            <input type="text" name="company_name" value={company_name} onChange={this.handleChange} className="form-control" id="txtComNameAdd" placeholder="Company Name" />
                          </div>
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
                {/* /.modal-content */}
              </div>
            </form>
            {/* /.modal-dialog */}
          </div>
        </BootstrapValidator>
        {/* /.modal */}
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

const connectedSetupCompany = connect(mapStateToProps)(SetupCompany);
export default connectedSetupCompany