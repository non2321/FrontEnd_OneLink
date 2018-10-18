import React from 'react'
import { connect } from 'react-redux'
import TableauReport from 'react-tableau-report'

import { userAuth } from '../../../../../actions/auth';
import { reportsdc } from '../../../../../actions/report'

import { WidgetGrid, JarvisWidget } from '../../../../../components'
import { ScreenIDReportEndingInventory, PathBackEnd, DropdownMonth, TableauEndingInventory } from '../../../../../../../settings'

import Select from 'react-select'
import 'react-select/dist/react-select.css'

const optiontableau = {
    hideTabs: true
}

class EndingInventory extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportEndingInventory,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        const datenow = new Date()
        const yearnow = datenow.getFullYear()
        let optionyear = []
        const yearago = yearnow - 10
        for (let year = yearago; year <= yearnow; year++) {
            const item = { "value": year, "label": year }
            optionyear.push(item)
        }

        this.state = {
            store: '',
            month: '',
            year: '',
            errorstore: '',
            errormonth: '',
            erroryear: '',
            optionyear: optionyear.sort((a, b) => b.value - a.value),
            submitted: false,
            screen_id: ScreenIDReportEndingInventory
        }

        this.handleChange = this.handleChange.bind(this)

        this.handleReset = this.handleReset.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value })
    }

    handleChangesMonth = (month) => {
        const { year, period } = this.state
        const self = this

        this.setState({
            month: (month == null) ? '' : month,
            period: (month == null) ? '' : period
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
        const { month, period } = this.state
        const self = this

        this.setState({
            year: (year == null) ? '' : year,
            period: (year == null) ? '' : period
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

    handleChangesStore = (store) => {
        this.setState({
            store: (store == null) ? '' : store
        })
    }

    handleChangesInven_category = (invencategory) => {
        this.setState({
            invencategory: (invencategory == null) ? '' : invencategory
        });
    }

    handleReset(e) {
        e.preventDefault();

        this.setState({ store: '', year: '', month: '', period: '', invencategory: '', stockno: '', submitted: false, parameters: null })
        this.setState({ errorperiod: '' })
    }

    handleSubmit(e) {
        e.preventDefault();

        const { dispatch } = this.props
        const { store, year, month, period, invencategory, stockno, screen_id } = this.state
        const self = this

        this.setState({
            errorstore: (store) ? '' : 'The Store is required',
            erroryear: (year) ? '' : 'The Year is required',
            errormonth: (month) ? '' : 'The Month is required',
            errorperiod: (period) ? '' : 'The Period is required',
            submitted: false
        })

        if (store && period && screen_id) {
            const prm = {
                screen_id: screen_id
            }           
            dispatch(reportsdc.generatetokentableau(prm))
            this.setState({
                parameters: {
                    'Store From': store.value,                   
                    'Period Id': period,
                    'P Inven Category': (invencategory) ? invencategory.value : 'All',
                    'P Stock Zone': (stockno) ? stockno : 'All'
                }
            })

            setTimeout(function () {
                self.setState({ submitted: true })
            }, 500)
        }
    }

    componentDidMount() {
        const { screen_id } = this.state 
        const { dispatch } = this.props

        const self = this
        let apiRequest1 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/report/storeall`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ options: data })
                    return data
                });
        }, 500)

        let apiRequest2 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/unitcost/ddlinvencategory`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ optioninven_category: data })
                    return data
                });
        }, 800)

        $(document).on('click', '.jarviswidget-fullscreen-btn', function () {
            self.setState({
                submitted: false
            });           
            const prm = {
                screen_id: screen_id
            }
            dispatch(reportsdc.generatetokentableauforfullscreen(prm))  

            setTimeout(function () {          
                self.setState({ submitted: true });
            }, 1000);
        })
    }

    render() {
        const { store, year, month, period, invencategory, stockno, options, optionyear, optioninven_category, submitted, parameters } = this.state;
        const { errorstore, erroryear, errormonth, errorperiod, errorinvencategory, errorstockno } = this.state;
        const { modify, screen_name, report } = this.props;

        const tokentableau = report.data
        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2></header>
                                {modify && <div className="widget-body ">
                                    <br />
                                    <fieldset>
                                        <div className="row">
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"><label > Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {options &&
                                                        <Select options={options} placeholder='Store' name="store" value={store} onChange={this.handleChangesStore} />
                                                    }
                                                    <span className="text-danger">{errorstore}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"></div>
                                                <div className="col-md-6">
                                                </div>
                                            </div>
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"></div>
                                                <div className="col-md-6">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"><label > Year</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionyear &&
                                                        <Select options={optionyear} placeholder='Year' name="year" value={year} onChange={this.handleChangesYear} />
                                                    }
                                                    <span className="text-danger">{erroryear}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"><label > Month</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {DropdownMonth &&
                                                        <Select options={DropdownMonth} placeholder='Month' name="month" value={month} onChange={this.handleChangesMonth} />
                                                    }
                                                    <span className="text-danger">{errormonth}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"><label > Period</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <input type="text" name="period" value={period} onChange={this.handleChange} className="form-control" placeholder="Period" disabled={true} />
                                                    <span className="text-danger">{errorperiod}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"><label > Inven Category</label></div>
                                                <div className="col-md-6">
                                                    {optioninven_category &&
                                                        <Select options={optioninven_category} placeholder='Inventory Category' name="invencategory" value={invencategory} onChange={this.handleChangesInven_category} />
                                                    }
                                                    <span className="text-danger">{errorinvencategory}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"><label > Stock No.</label></div>
                                                <div className="col-md-6">
                                                    <input type="text" name="stockno" value={stockno} onChange={this.handleChange} className="form-control" placeholder="Stock No." />
                                                    <span className="text-danger">{errorstockno}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 form-group">
                                                <div className="col-md-4 control-label"></div>
                                                <div className="col-md-6">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label">
                                                </div>
                                                <div className="col-md-6 smart-form">
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="btn-header transparent pull-right">
                                                        <button className="btn btn-primary btn-sm" onClick={this.handleReset}>
                                                            <i className="fa  fa-refresh"></i> Reset
                                                            </button>
                                                    </div>
                                                    <div className="btn-header transparent pull-right">
                                                        <button className="btn btn-primary btn-sm" onClick={this.handleSubmit}>
                                                            <i className="fa  fa-print"></i> Export
                                                            </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {submitted && tokentableau && parameters && <div className="row">
                                            <div className="col-md-12">
                                                <hr />
                                                <div style={{ minwidth: '800px', minheight: '573px', overflow: 'scroll' }}>
                                                    <TableauReport
                                                        url={TableauEndingInventory}
                                                        token={tokentableau}
                                                        parameters={parameters}
                                                        options={optiontableau}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                        }
                                    </fieldset>
                                </div>
                                }
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
            </div>
        )
    }
}


function mapStateToProps(state) {
    const { loadpage, report } = state;
    const screen_name = loadpage.screen_name
    const modify = loadpage.modify
    return {
        modify,
        screen_name,
        report
    };
}

const connectedEndingInventory = connect(mapStateToProps)(EndingInventory);
export default connectedEndingInventory