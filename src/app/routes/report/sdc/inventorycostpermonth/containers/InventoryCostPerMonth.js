import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'
import TableauReport from 'react-tableau-report'

import { userAuth } from '../../../../../actions/auth'
import { reportsdc } from '../../../../../actions/report'

import { WidgetGrid, JarvisWidget } from '../../../../../components'
import { ScreenIDReportInventoryCostPerMonth, PathBackEnd, TableauInventoryCostPerMonth } from '../../../../../../../settings'


import Select from 'react-select'
import 'react-select/dist/react-select.css'

const optiontableau = {
    hideTabs: true,
}

class InventoryCostPerMonth extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportInventoryCostPerMonth,
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
            year: '',
            optionyear: optionyear.sort((a, b) => b.value - a.value),
            submitted: false,
            screen_id: ScreenIDReportInventoryCostPerMonth
        }


        this.handleReset = this.handleReset.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleReset(e) {
        e.preventDefault();

        this.setState({ year: '', period: '', submitted: false, parameters: null })
        this.setState({ erroryear: '', errorperiod: '' })
    }

    handleSubmit(e) {
        e.preventDefault();

        const { dispatch } = this.props
        const { year, period, screen_id } = this.state
        const self = this

        this.setState({
            erroryear: (year) ? '' : 'The Year is required',
            errorperiod: (period) ? '' : 'The Period is required',
            submitted: false
        })

        if (year && period && screen_id) {
            const prm = {
                screen_id: screen_id
            }
            dispatch(reportsdc.generatetokentableau(prm))
            this.setState({
                parameters: {
                    'Period Id': period.value
                }
            })

            setTimeout(function () {
                self.setState({ submitted: true })
            }, 500)
        }
    }

    handleChangesYear = (year) => {
        const { tempperiod } = this.state

        this.setState({
            year: (year == null) ? '' : year,
            period: '',
            optionperiod: (year == null) ? '' : tempperiod.filter((task) => task.year == year.value)
        })
    }

    handleChangesPeriod = (period) => {
        this.setState({
            period: (period == null) ? '' : period
        })
    }

    componentDidMount() {
        const { screen_id } = this.state
        const { dispatch } = this.props

        const self = this
        let apiRequest1 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/importtojde/ddlperiod`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ tempperiod: data })
                    return data
                });
        }, 300)

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
        const { year, period, optionyear, tempperiod, optionperiod, submitted, parameters } = this.state;
        const { errorperiod, erroryear } = this.state;
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
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > Year</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionyear &&
                                                        <Select options={optionyear} placeholder='Year' name="year" value={year} onChange={this.handleChangesYear} />
                                                    }
                                                    <span className="text-danger">{erroryear}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > Period (End Date)</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {tempperiod &&
                                                        <Select options={optionperiod} placeholder='Period' name="period" value={period} onChange={this.handleChangesPeriod} disabled={!year} />
                                                    }
                                                    <span className="text-danger">{errorperiod}</span>
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
                                                        url={TableauInventoryCostPerMonth}
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

const connectedInventoryCostPerMonth = connect(mapStateToProps)(InventoryCostPerMonth);
export default connectedInventoryCostPerMonth