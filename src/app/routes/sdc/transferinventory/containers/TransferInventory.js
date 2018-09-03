import React from 'react'
import { connect } from 'react-redux'
import Delay from 'react-delay'

import { userAuth } from '../../../../actions/auth'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import PopupStore from '../../../../components/tables-popup/PopupStore'
import UiDatepicker from '../../../../components/forms/inputs/UiDatepicker'

import { utils } from '../../../../services'

import { ScreenIDTransferInventory, PathBackEnd, DropdownMonth } from '../../../../../../settings'

import DatatableTransferInventory from '../../../../components/tables/DatatableTransferInventory'


class TransferInventory extends React.Component {
    constructor(props) {
        super(props)
        const self = this

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDTransferInventory,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            stamp: 'option1',
            submitted: false,
            screen_id: ScreenIDTransferInventory
        }

        this.handleChange = this.handleChange.bind(this)

        this.handleData = this.handleData.bind(this)
        this.handlePopSubmit = this.handlePopSubmit.bind(this)

        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)

        this.onStampChanged = this.onStampChanged.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value })
    }

    handleData(data) {
        this.setState({
            fromChild: data
        })
    }

    handlePopSubmit(e) {
        e.preventDefault()
        const data = this.state.fromChild
        this.setState({ store_id: data['store_id'], store_name: data['store_name'], fromChild: '' })
        $('#myModalStore').modal('hide')
    }

    onStampChanged(e) {
        this.setState({
            stamp: e.target.value
        });
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



    handleSearchSubmit(e) {
        e.preventDefault()
        const self = this
        const { store_id, stamp, datefrom, dateto } = this.state

        this.setState({
            errorstore_id: (store_id) ? '' : 'The store id is required',
            submitted: false
        })

        if (stamp, store_id) {
            setTimeout(() => {
                self.setState({
                    datastamp: stamp,
                    datastore_id: store_id,
                    datadatefrom: (datefrom) ? utils.convertdateformatString(datefrom) : undefined,
                    datadateto: (dateto) ? utils.convertdateformatString(dateto) : undefined,
                    submitted: true
                })
            }, 500)
        }
    }

    componentDidMount() {

    }

    render() {
        const { errorstore_id, errordatefrom, errordateto } = this.state
        const { store_id, store_name, stamp, datefrom, dateto, submitted } = this.state
        const { datastamp, datastore_id, datadatefrom, datadateto } = this.state
        const { modify, screen_name } = this.props;
        const seft = this

        console.log(`${PathBackEnd}/api/transferinventory/${datastamp}/${datastore_id}/${datadatefrom}/${datadateto}`)
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
                                            <div className="form-group">
                                                <div className="col-md-6 ">
                                                    <div className="col-md-4 control-label"><label > Type</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-4 smart-form">
                                                        <label className="radio align-top">
                                                            <input type="radio" name="radio-inline" value="option1" checked={stamp === 'option1'} onChange={this.onStampChanged} />
                                                            <i />Transfer Out</label>
                                                    </div>
                                                    <div className="col-md-4 smart-form ">
                                                        <label className="radio align-top">
                                                            <input type="radio" name="radio-inline" value="option2" checked={stamp === 'option2'} onChange={this.onStampChanged} />
                                                            <i />Transfer In</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="col-md-4 control-label"></div>
                                                    <div className="col-md-6">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-6">
                                                    <div className="col-md-4 control-label"><label > Store ID</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-4 ">
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
                                                    <div className="col-md-4 control-label"><label >Transfer Data From</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-6">
                                                        <UiDatepicker type="text" name="datefrom" id="datefrom" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy"
                                                            addday="120" datefrom="#datefrom" dateto="#dateto" onInputChange={this.handleDateFrom} value={datefrom}
                                                            placeholder="Start date" />
                                                        <span className="text-danger">{errordatefrom}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-6">
                                                    <div className="col-md-4 control-label"><label > Store Name</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-6">
                                                        <input type="text" name="store_name" value={store_name} onChange={this.handleChange} className="form-control" placeholder="Store Name" disabled={true} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="col-md-4 control-label"><label >Transfer Data To</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-6">
                                                        <UiDatepicker type="text" name="dateto" id="dateto" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy"
                                                            onInputChange={this.handleDateTo} value={dateto} disabled={!dateto}
                                                            placeholder="Finish date" />
                                                        <span className="text-danger">{errordateto}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-6">
                                                    <div className="col-md-4 control-label"></div>
                                                    <div className="col-md-6">
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="col-md-4 control-label"></div>
                                                    <div className="col-md-6">
                                                        <div className="btn-header transparent pull-right">
                                                            <button className="btn btn-primary btn-default">
                                                                <i className="fa  fa-search"></i> Search
                                                                </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {submitted && datastore_id &&
                                        <div className="widget-body no-padding">
                                            <hr />
                                            {datastamp == 'option1' &&
                                                <DatatableTransferInventory
                                                    options={{
                                                        colReorder: true,
                                                        ajax: `${PathBackEnd}/api/transferinventory/${datastamp}/${datastore_id}/${datadatefrom}/${datadateto}`,
                                                        columns: [{ data: "STOCK_NUM" }, { data: "INV_ITEM_DESC" }, { data: "DESTINATION" }, { data: "COUNT_DESC" }, { data: "S_NUM_TRANSFERRED" }, { data: "NUM_TRANSFERRED" }, { data: "COST_PER_COUNT" }, { data: "TRANSFER_DATE" }],
                                                        buttons: [
                                                        ],
                                                    }}
                                                    paginationLength={true} className="table table-striped table-bordered table-hover"
                                                    width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th data-class="expand"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Stock No.
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Inv Item Description
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Destination
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Uom
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Qty
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Acc Qty
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Cost Per Count
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Transfer Date
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </DatatableTransferInventory>
                                            }
                                            {datastamp == 'option2' &&
                                                <DatatableTransferInventory
                                                    options={{
                                                        colReorder: true,
                                                        ajax: `${PathBackEnd}/api/transferinventory/${datastamp}/${datastore_id}/${datadatefrom}/${datadateto}`,
                                                        columns: [{ data: "STOCK_NUM" }, { data: "INV_ITEM_DESC" }, { data: "SOURCE" }, { data: "COUNT_DESC" }, { data: "S_NUM_TRANSFERRED" }, { data: "NUM_TRANSFERRED" }, { data: "COST_PER_COUNT" }, { data: "TRANSFER_DATE" }],
                                                        buttons: [
                                                        ],
                                                    }}
                                                    paginationLength={true} className="table table-striped table-bordered table-hover"
                                                    width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th data-class="expand"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Stock No.
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Inv Item Description
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Source
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Uom
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Qty
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Acc Qty
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Cost Per Count
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Transfer Date
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </DatatableTransferInventory>
                                            }
                                        </div>
                                    }
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

const connectedTransferInventory = connect(mapStateToProps)(TransferInventory);
export default connectedTransferInventory