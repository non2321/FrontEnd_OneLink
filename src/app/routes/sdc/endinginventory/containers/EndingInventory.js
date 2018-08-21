import React from 'react'
import { connect } from 'react-redux'
import Delay from 'react-delay'

import { userAuth } from '../../../../actions/auth';
import { inventoryActions } from '../../../../actions/sdc'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import PopupStore from '../../../../components/tables-popup/PopupStore'

import { ScreenIDEndingInventory, PathBackEnd } from '../../../../../../settings'

import Select from 'react-select'
import 'react-select/dist/react-select.css';

class EndingInventory extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDEndingInventory,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            stamp: 'option1',
            submitted: false,
            screen_id: ScreenIDEndingInventory
        }

        this.handleChange = this.handleChange.bind(this)

        this.handleData = this.handleData.bind(this)
        this.handlePopSubmit = this.handlePopSubmit.bind(this)

        this.onStampChanged = this.onStampChanged.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleData(data) {
        this.setState({
            fromChild: data
        });
    }

    handlePopSubmit(e) {
        e.preventDefault()
        const data = this.state.fromChild
        this.setState({ store_id: data['store_id'], store_name: data['store_name'], fromChild: '' })
        $('#myModalStore').modal('hide');
    }

    onStampChanged(e) {
        this.setState({
            stamp: e.target.value
        });
    }

    handleSearchSubmit(e) {
        e.preventDefault()
        // const selft = this
        // this.setState({ submitted: false, daysOfStore: [] })
        // const { store_id, datefrom, dateto } = this.state     

        // this.setState({
        //     store_id_temp: store_id,
        //     errorstore_id: (store_id) ? '' : 'The store id is required',
        //     errordatefrom: (datefrom) ? '' : 'The Financial Date From is required',
        //     errordateto: (dateto) ? '' : 'The Financial Date To is required',
        //     submitted: false
        // })

        // if (store_id && datefrom && dateto) {

        //     let datePartsfrom = datefrom.split("/");
        //     let dateObjectfrom = new Date(datePartsfrom[2], datePartsfrom[1] - 1, datePartsfrom[0])

        //     let datePartsto = dateto.split("/");
        //     let dateObjectto = new Date(datePartsto[2], datePartsto[1] - 1, datePartsto[0])

        //     let days = [];
        //     for (let d = dateObjectfrom; d <= dateObjectto; d.setDate(d.getDate() + 1)) {
        //         days.push(new Date(d));
        //     }
        //     this.setState({ daysOfStore: days, tabIndex: 0 })
        //     setTimeout(function () {
        //         selft.setState({ submitted: true })
        //     }, 500)
        // }
    }




    render() {
        // const { action_code, inv_class, action, obj_account, subsidary, grp_by, cat_code, acc_type, doc_no, remark, submitted, screen_id } = this.state;
        // const { optiongrp_by, optioncat_code, optionacc_type } = this.state
        const { errorstore_id } = this.state
        const { store_id, store_name, stamp } = this.state
        const { modify, screen_name } = this.props;
        const seft = this

        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2></header>
                                {modify && <div className="widget-body ">
                                    <br />
                                    <form onSubmit={this.handleSearchSubmit}>
                                        <div className="form-horizontal">
                                            <fieldset>
                                                <div className="form-group">
                                                    <div className="col-md-6 smart-form">
                                                        <div className="inline-group">
                                                            <label className="radio">
                                                                <input type="radio" name="radio-inline" value="option1" checked={stamp === 'option1'} onChange={this.onStampChanged} />
                                                                <i />Summary</label>
                                                            <label className="radio">
                                                                <input type="radio" name="radio-inline" value="option2" checked={stamp === 'option2'} onChange={this.onStampChanged} />
                                                                <i />Detail</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                        <div className="col-md-3 control-label"><label > Store ID</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-4">
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
                                                    <div className="col-md-6">
                                                        <div className="col-md-4 control-label"><label >Store Name</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <input type="text" name="store_name" value={store_name} onChange={this.handleChange} className="form-control" placeholder="Store Name" disabled={true} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                        <div className="col-md-3 control-label"><label > Store Name</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            {/* <UiDatepicker type="text" name="startdate" id="startdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="7" datefrom="#startdate" dateto="#finishdate" onInputChange={this.handleDateFrom} value={datefrom}
                                                                placeholder="Start date" />
                                                            <span className="text-danger">{errordatefrom}</span> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4 control-label"><label >Financial Date To</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            {/* <UiDatepicker type="text" name="finishdate" id="finishdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="7" onInputChange={this.handleDateTo} value={dateto} disabled={!datefrom}                                                              
                                                                placeholder="Finish date" />
                                                            <span className="text-danger">{errordateto}</span> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-5">
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="btn-header transparent pull-right">
                                                                <button className="btn btn-primary btn-default">
                                                                    <i className="fa  fa-search"></i> Search
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </form>
                                </div>
                                }
                            </JarvisWidget>
                        </article>

                        {/* Modal Store */}
                        <div className="modal fade" id="myModalStore" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="true">
                            <form id="pop-form" onSubmit={this.handlePopSubmit}>
                                <div className="modal-dialog ">
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
                                                        ajax: `${PathBackEnd}/api/bankinadjustment/popupstore`,
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

const connectedEndingInventory = connect(mapStateToProps)(EndingInventory);
export default connectedEndingInventory