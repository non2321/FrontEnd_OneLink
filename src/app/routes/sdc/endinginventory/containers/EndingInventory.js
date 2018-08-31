import React from 'react'
import { connect } from 'react-redux'
import Delay from 'react-delay'

import { userAuth } from '../../../../actions/auth'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import PopupStore from '../../../../components/tables-popup/PopupStore'

import { ScreenIDEndingInventory, PathBackEnd, DropdownMonth } from '../../../../../../settings'

import DatatableEndingInventory from '../../../../components/tables/DatatableEndingInventory'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

class EndingInventory extends React.Component {
    constructor(props) {
        super(props)
        const self = this

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDEndingInventory,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        const datenow = new Date()
        const monthnow = datenow.getMonth()
        const yearnow = datenow.getFullYear()
        let optionyear = []
        const yearago = yearnow - 10
        for (let year = yearago; year <= yearnow; year++) {
            const item = { "value": year, "label": year }
            optionyear.push(item)
        }

        this.state = {
            stamp: 'option1',
            month: monthnow,
            year: yearnow,
            optionyear: optionyear.sort((a, b) => b.value - a.value),
            submitted: false,
            screen_id: ScreenIDEndingInventory
        }

        this.handleChange = this.handleChange.bind(this)

        this.handleData = this.handleData.bind(this)
        this.handlePopSubmit = this.handlePopSubmit.bind(this)

        this.handleChangesMonth = this.handleChangesMonth.bind(this)

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

    handleChangesMonth = (month) => {
        const { year } = this.state
        const self = this

        this.setState({
            month: (month == null) ? '' : month
        })
        if (month && year) {
            const prm_year = (year.value) ? year.value : year
            const prm_month = (month.value) ? month.value : month

            const apiRequest = setTimeout(function () {
                fetch(`${PathBackEnd}/api/endinginventory/getperiod/${prm_year}/${prm_month}`)
                    .then(response => response.json())
                    .then(data => {
                        self.setState({ period: data[0].value })
                        return data
                    });
            }, 200)
        }

    }

    handleChangesYear = (year) => {
        const { month } = this.state
        const self = this

        this.setState({
            year: (year == null) ? '' : year
        })

        if (month && year) {
            const prm_year = (year.value) ? year.value : year
            const prm_month = (month.value) ? month.value : month

            const apiRequest = setTimeout(function () {
                fetch(`${PathBackEnd}/api/endinginventory/getperiod/${prm_year}/${prm_month}`)
                    .then(response => response.json())
                    .then(data => {
                        self.setState({ period: data[0].value })
                        return data
                    });
            }, 200)
        }
    }

    handleSearchSubmit(e) {
        e.preventDefault()
        const self = this
        const { store_id, stamp, diff_more_than, year, month, period } = this.state

        this.setState({
            errorstore_id: (store_id) ? '' : 'The store id is required',
            // errordiff_more_than: (diff_more_than) ? '' : 'The diif more than is required',
            erroryear: (year) ? '' : 'The year is required',
            errormonth: (month) ? '' : 'The month is required',
            errorperiod: (period) ? '' : 'The period is required',
            submitted: false
        })

        if (stamp, store_id, year, month, period) {
            setTimeout(() => {
                self.setState({
                    datastamp: stamp,
                    datastore_id: store_id,
                    datadiff_more_than: (diff_more_than) ? diff_more_than : 0,
                    dataperiod: period,
                    submitted: true
                })
            }, 500)
        }
    }

    componentDidMount() {
        const { year, month } = this.state
        const self = this

        if (month && year) {

            const prm_year = (year.value) ? year.value : year
            const prm_month = (month.value) ? month.value : month
            const apiRequest = setTimeout(function () {
                fetch(`${PathBackEnd}/api/endinginventory/getperiod/${prm_year}/${prm_month}`)
                    .then(response => response.json())
                    .then(data => {                       
                        self.setState({ period: data[0].value })
                        return data
                    });
            }, 300)
        }
    }

    render() {
        const { errorstore_id, errordiff_more_than, erroryear, errormonth, errorperiod } = this.state
        const { store_id, store_name, stamp, diff_more_than, year, month, period, optionyear, submitted } = this.state
        const { datastamp, datastore_id, datadiff_more_than, dataperiod } = this.state
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
                                            <div className="form-group">
                                                <div className="col-md-4 ">
                                                    <div className="col-md-4 control-label"><label > Type</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-4 smart-form">
                                                        <label className="radio align-top">
                                                            <input type="radio" name="radio-inline" value="option1" checked={stamp === 'option1'} onChange={this.onStampChanged} />
                                                            <i />Summary</label>
                                                    </div>
                                                    <div className="col-md-4 smart-form ">
                                                        <label className="radio align-top">
                                                            <input type="radio" name="radio-inline" value="option2" checked={stamp === 'option2'} onChange={this.onStampChanged} />
                                                            <i />Detail</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"></div>
                                                    <div className="col-md-7">
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"></div>
                                                    <div className="col-md-7">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label > Store ID</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-6">
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
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Store Name</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        <input type="text" name="store_name" value={store_name} onChange={this.handleChange} className="form-control" placeholder="Store Name" disabled={true} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Diff More than</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        <input type="number" name="diff_more_than" value={diff_more_than} onChange={this.handleChange} className="form-control" placeholder="Diff More than" />
                                                        <span className="text-danger">{errordiff_more_than}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label > Year</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        {optionyear &&
                                                            <Select options={optionyear} placeholder='Year' name="year" value={year} onChange={this.handleChangesYear} />
                                                        }
                                                        <span className="text-danger">{erroryear}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Month</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        {DropdownMonth &&
                                                            <Select options={DropdownMonth} placeholder='Month' name="month" value={month} onChange={this.handleChangesMonth} />
                                                        }
                                                        <span className="text-danger">{errormonth}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Period</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        <input type="text" name="period" value={period} onChange={this.handleChange} className="form-control" placeholder="Period" disabled={true} />
                                                        <span className="text-danger">{errorperiod}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                </div>
                                                <div className="col-md-4">
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4">
                                                    </div>
                                                    <div className="col-md-7">
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
                                    {submitted && 
                                        <div className="widget-body no-padding">
                                            <hr />
                                            {datastamp == 'option1' &&
                                                <DatatableEndingInventory
                                                    options={{
                                                        colReorder: true,
                                                        ajax: `${PathBackEnd}/api/endinginventory/${datastamp}/${datastore_id}/${datadiff_more_than}/${period}`,
                                                        columns: [{ data: "STORE_ID" }, { data: "store_name" }, { data: "ACC" }, { data: "STR" }],
                                                        buttons: [
                                                        ],
                                                    }}
                                                    paginationLength={true} className="table table-striped table-bordered table-hover"
                                                    width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th data-class="expand"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Name
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Acc
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Str
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </DatatableEndingInventory>
                                            }
                                            {datastamp == 'option2' &&
                                                <DatatableEndingInventory
                                                    options={{
                                                        colReorder: true,
                                                        ajax: `${PathBackEnd}/api/endinginventory/${datastamp}/${datastore_id}/${datadiff_more_than}/${period}`,
                                                        columns: [{ data: "store" },
                                                        { data: "store_name" }, { data: "stock_num" }, { data: "inv_item" }, { data: "inv_item_desc" }, { data: "uom" }, { data: "s_p_ending_inv" }, { data: "p_ending_inv" }, { data: "diff" }
                                                        ],
                                                        buttons: [
                                                        ],
                                                    }}
                                                    paginationLength={true} className="table table-striped table-bordered table-hover"
                                                    width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th data-class="expand"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Name
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Stock No.
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Inv Item
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Description
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                UOM
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store End Inv
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Acc End Inv
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Absolute Diff
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </DatatableEndingInventory>
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

const connectedEndingInventory = connect(mapStateToProps)(EndingInventory);
export default connectedEndingInventory