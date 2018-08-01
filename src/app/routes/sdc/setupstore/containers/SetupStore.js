import React from 'react'
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip'
import Delay from 'react-delay'

import { userAuth } from '../../../../actions/auth';
import { storeActions } from '../../../../actions/sdc'
import { alertActions } from '../../../../actions/alert'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import { smallBox, bigBox, SmartMessageBox } from '../../../../components/utils/actions/MessageActions'
import UiValidate from '../../../../components/forms/validation/UiValidate'
import BootstrapValidator from '../../../../components/forms/validation/BootstrapValidator'
import DatatableStore from '../../../../components/tables/DatatableStore'

import PopupStore from '../../../../components/tables-popup/PopupStore'

import { ScreenIDSetupStore, PathBackEnd } from '../../../../../../settings'

import { Async } from 'react-select';
import 'react-select/dist/react-select.css';



const getOptions = () => {
  return fetch(`${PathBackEnd}/api/storeconfig/ddlbank`)
    .then((response) => {
      return response.json();
    }).then((json) => {
      return { options: json };
    });
}


class SetupStore extends React.Component {
  constructor(props) {
    super(props)

    if(this.state === undefined){
      const prm = {
        screen_id: ScreenIDSetupStore,
      }
      this.props.dispatch(userAuth.loadpage(prm))
    }  

    this.state = {
      store_id: '',
      errorstore_id: '',
      store_name: '',
      bank_code: '',
      errorbank_code: '',
      submitted: false,
      screen_id: ScreenIDSetupStore
    }    

    this.handleChange = this.handleChange.bind(this)
    this.handleAddSubmit = this.handleAddSubmit.bind(this)

    this.handleData = this.handleData.bind(this);
    this.handlePopSubmit = this.handlePopSubmit.bind(this)
  }

  handleChanges = (bank_code) => {
    this.setState({ bank_code });
  }

  handlePopSubmit(e) {
    e.preventDefault()
    const data = this.state.fromChild
    this.setState({ store_id: data['store_id'], store_name: data['store_name'], fromChild: '' })
    $('#myModalStore').modal('hide');
  }

  handleData(data) {
    this.setState({
      fromChild: data
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddSubmit(e) {
    e.preventDefault();
    const { store_id, store_name, bank_code, screen_id } = this.state;
    const { dispatch } = this.props;

    this.setState({
      errorstore_id: (store_id) ? '' : 'The store id is required',
      errorbank_code: (bank_code) ? '' : 'The bank code is required'
    })
    if (store_id && bank_code.value) {
      this.setState({ submitted: true })
      const prm = {
        store_code: store_id.toString(),
        bank_code: bank_code.value.toString(),
        screen_id: screen_id,
      }
      dispatch(storeActions.addstore(prm));
    }
  }



  render() {
    let { store_id, store_name, bank_code, errorstore_id, errorbank_code, submitted, modifydata, screen_id } = this.state

    const { modify, screen_name } = this.props;
    const seft = this

    return (
      <div id="content">
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12">
              <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                <header><h2>{screen_name}</h2></header>
                <div>
                  <div className="widget-body no-padding">
                    {modify && <DatatableStore
                      screen_id={screen_id}
                      screen_name={screen_name}
                      options={{
                        colReorder: true,
                        ajax: `${PathBackEnd}/api/storeconfig`,
                        columns: [{ data: "STORE" }, { data: "BANK_NAME" }, { data: "BANK_BRANCH" },
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
                            text: `<span id='test' ><i class="fa fa-plus" /><span class="hidden-mobile"> Add</span></span>`,
                            className: `btn btn-primary btn-sm ${(modify.can_add == "Y") ? '' : 'hidden'}`,
                            action: function (e, dt, node, config) {
                              $("#myModalAdd").modal()
                              seft.setState({ store_id: '', store_name: '', bank_code: '' })
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
                            Store
                              </th>
                          <th data-class="expand"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Bank Code
                            </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Branch
                            </th>
                          <th data-hide="user" className="text-right">
                          </th>
                        </tr>
                      </thead>
                    </DatatableStore>
                    }
                  </div>
                </div>
              </JarvisWidget>
            </article>
          </div>
          <div>
            {/* Modal Add */}
            <div className="modal fade" id="myModalAdd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
              aria-hidden="true">
              {modify && <form id="add-form" onSubmit={this.handleAddSubmit}>
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
                          {/* <div className="form-group">
                           <div className="col-md-4">
                           <label htmlFor="store_id"> Store ID</label>
                              <div className="input-group">
                              <input type="text" name="store_id" value={store_id} onChange={this.handleChange} className="form-control"  placeholder="Store ID" disabled={true} />
                                <a className="btn btn-primary input-group-addon "><i data-toggle="modal" data-target="#myModalStore"
                                  className="fa fa-user-md" /></a>
                              </div>                             
                            </div>
                          </div>                           */}
                          <div className="col-md-4">
                            <label htmlFor="store_id"> Store ID</label>
                            <div class="input-group">
                              <span className="input-group-btn">
                                <input type="text" name="store_id" value={store_id} onChange={this.handleChange} className="form-control" id="txtStoreId" placeholder="Store ID" disabled={true} />
                                <a className="btn btn-primary" id="btn-chat" data-toggle="modal" data-target="#myModalStore">
                                  <i className="fa fa-user-md"></i>
                                </a>
                              </span>
                            </div>
                            <span className="text-danger">{errorstore_id}</span>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label htmlFor="store_name"> Store Name</label>
                            <input type="text" name="store_name" value={store_name} onChange={this.handleChange} className="form-control" id="txtStoreName" placeholder="Store Name" disabled={true} />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label htmlFor="bank_code"> Bank Code</label>
                            <Delay wait={250} >
                              <Async
                                placeholder='Bank Code'
                                name="bank_code"
                                loadOptions={getOptions}
                                value={bank_code}
                                onChange={this.handleChanges}
                              />
                            </Delay>
                            <span className="text-danger">{errorbank_code}</span>
                            <div >
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
                </div>
              </form>
              }
            </div>

            {/* Modal Store */}
            <div className="modal fade" id="myModalStore" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
              aria-hidden="true">
              <form id="pop-form" onSubmit={this.handlePopSubmit}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                      </button>
                      <h4 className="modal-title" id="myModalLabel">{screen_name}</h4>
                    </div>
                    <div className="no-padding">
                      {modify && <Delay wait={1000} >
                        <PopupStore handlerFromParant={this.handleData}
                          options={{
                            colReorder: true,
                            ajax: `${PathBackEnd}/api/storeconfig/popupstore`,
                            columns: [{ data: "STORE_ID" }, { data: "STORE_NAME" }
                            ],
                          }}
                          paginationLength={true} className="table table-striped table-bordered table-hover"
                          width="100%">
                          <thead>
                            <tr>
                              <th data-hide="user"><i
                                className=" text-muted hidden-md hidden-sm hidden-xs" />
                                Store Code
                              </th>
                              <th data-class="expand"><i
                                className=" text-muted hidden-md hidden-sm hidden-xs" />
                                Store Name
                            </th>
                            </tr>
                          </thead>
                        </PopupStore>
                      </Delay>
                      }
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
        </WidgetGrid>
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

const connectedSetupStore = connect(mapStateToProps)(SetupStore);
export default connectedSetupStore