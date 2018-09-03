import React from 'react'
import { connect } from 'react-redux'
import Delay from 'react-delay'

import { userAuth } from '../../../../actions/auth'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import { PathBackEnd, ScreenIDReceipts } from '../../../../../../settings'
import { utils } from '../../../../services/utils'

import DatatableReceipts from '../../../../components/tables/DatatableReceipts'
import UiDatepicker from '../../../../components/forms/inputs/UiDatepicker'
import PopupStore from '../../../../components/tables-popup/PopupStore'

class Receipts extends React.Component {
    constructor(props) {
        super(props);

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReceipts,
            }
            this.props.dispatch(userAuth.loadpage(prm));
        }

        this.state = {
            submitted: false,
            screen_id: ScreenIDReceipts
        }

        this.handleChange = this.handleChange.bind(this)

        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)

        this.handleData = this.handleData.bind(this)
        this.handlePopSubmit = this.handlePopSubmit.bind(this)

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    }


    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleDateFrom(data) {
        this.setState({
            datefrom: data, dateto: data
        });
    }

    handleDateTo(data) {
        this.setState({
            dateto: data
        });
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

    handleSearchSubmit(e) {
        e.preventDefault()
        const self = this

        const { store_id, datefrom, dateto, invoice_no } = this.state

        this.setState({
            errorstore_id: (store_id) ? '' : 'The store id is required',
            errordatefrom: (datefrom) ? '' : 'The Financial Date From is required',
            errordateto: (dateto) ? '' : 'The Financial Date To is required',
            // errorinvoice_no: (invoice_no) ? '' : 'The Invoice No To is required',
            submitted: false
        })

        if (store_id && datefrom && dateto) {
            setTimeout(() => {
                self.setState({
                    datastore_id: store_id,
                    datadatefrom: utils.convertdateformatString(datefrom),
                    datadateto: utils.convertdateformatString(dateto),
                    datainvoice_no: invoice_no,
                    submitted: true
                })
            }, 500)
        }
    }

    render() {
        const { store_id, store_name, datefrom, dateto, invoice_no, screen_id } = this.state
        const { datastore_id, datadatefrom, datadateto, datainvoice_no, submitted } = this.state
        const { errorstore_id, errordatefrom, errordateto, errorinvoice_no } = this.state
        const { modify, screen_name } = this.props
        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2></header>
                                {modify && <div>
                                    <div className="widget-body">
                                        <br />
                                        <div className="form-horizontal">
                                            <fieldset>
                                                <div className="form-group">
                                                    <div className="col-md-6 ">
                                                        <div className="col-md-3 control-label"><label > Store ID</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-4">
                                                            <div className="input-group">
                                                                <input type="text" name="store_id" value={store_id} onChange={this.handleChange} className="form-control" id="txtStoreId" placeholder="Store ID" disabled={true} />
                                                                <span class="input-group-btn">
                                                                    <a className="btn btn-primary" id="btn-chat" data-toggle="modal" data-target="#myModalStore">
                                                                        <i className="fa fa-user-md"></i>
                                                                    </a>
                                                                </span>
                                                            </div>
                                                            <span className="text-danger">{errorstore_id}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4 control-label"><label >Financial Date From</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <UiDatepicker type="text" name="startdate" id="startdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" datefrom="#startdate" dateto="#finishdate" onInputChange={this.handleDateFrom} value={datefrom}
                                                                placeholder="Start date" />
                                                            <span className="text-danger">{errordatefrom}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                        <div className="col-md-3 control-label"><label > Store Name</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <input type="text" name="store_name" value={store_name} onChange={this.handleChange} className="form-control" placeholder="Store Name" disabled={true} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4 control-label"><label >Financial Date To</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <UiDatepicker type="text" name="finishdate" id="finishdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" onInputChange={this.handleDateTo} value={dateto} disabled={!datefrom}
                                                                placeholder="Finish date" />
                                                            <span className="text-danger">{errordateto}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                        <div className="col-md-3 control-label"><label > Invoice No</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <input type="text" name="invoice_no" value={invoice_no} onChange={this.handleChange} className="form-control" placeholder="Invoice No" />
                                                            <span className="text-danger">{errorinvoice_no}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4"></div>
                                                        <div className="col-md-6">
                                                            <button onClick={this.handleSearchSubmit} className="btn btn-primary btn-default pull-right">
                                                                <i className="fa  fa-search"></i> Search
                                                                </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        {submitted && datastore_id && datadatefrom && datadateto &&
                                            <div className="widget-body no-padding">
                                                <hr />
                                                <DatatableReceipts
                                                    options={{
                                                        colReorder: true,
                                                        ajax: `${PathBackEnd}/api/receipts/${datastore_id}/${datadatefrom}/${datadateto}/${(datainvoice_no) ? datainvoice_no : ''}`,
                                                        columns: [{ data: "INVOICE", "width": "9%" }, { data: "STOCK_NUM", "width": "8%" }, { data: "INV_ITEM_DESC" }, { data: "RECEIPT_DATE_DESC", "width": "10%" }, { data: "VENDOR_NAME", "width": "15%" }, { data: "UNITS_DESC", "width": "6%" },
                                                        {
                                                            data: "RECEIVED", "width": "8%",
                                                            className: 'text-right',
                                                            render: function (data, type, row) {
                                                                return parseFloat(Math.round(data * 100) / 100).toFixed(2)
                                                            }
                                                        },
                                                        {
                                                            data: "INVOICE_AMOUNT", "width": "8%",
                                                            className: 'text-right',
                                                            render: function (data, type, row) {
                                                                return parseFloat(Math.round(data * 100) / 100).toFixed(2)
                                                            }
                                                        },
                                                        {
                                                            data: "S_RECEIVED", "width": "8%",
                                                            className: 'text-right',
                                                            render: function (data, type, row) {
                                                                return parseFloat(Math.round(data * 100) / 100).toFixed(2)
                                                            }
                                                        },
                                                        {
                                                            data: "S_INVOICE_AMOUNT", "width": "8%",
                                                            className: 'text-right',
                                                            render: function (data, type, row) {
                                                                return parseFloat(Math.round(data * 100) / 100).toFixed(2)
                                                            }
                                                        },],
                                                        buttons: [
                                                        ],
                                                    }}
                                                    paginationLength={true} className="table table-striped table-bordered table-hover"
                                                    width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th data-class="expand"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Invoice No.
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Stock No.
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Inven Item Description
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Invoice Date
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Vendor
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                UOM
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Recv QTY
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Recv AMT
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                ACC Recv QTY
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs " />
                                                                ACC Recv AMT
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </DatatableReceipts>
                                            </div>
                                        }
                                    </div>
                                </div>
                                }
                            </JarvisWidget>
                        </article>
                    </div>
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

const connectedReceipts = connect(mapStateToProps)(Receipts);
export default connectedReceipts