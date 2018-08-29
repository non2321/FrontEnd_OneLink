import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import { userAuth } from '../../../../actions/auth'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import { PathBackEnd, ScreenIDImportToJDE } from '../../../../../../settings'

class ImportToJDE extends React.Component {
    constructor(props) {
        super(props);

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDImportToJDE,
            }
            this.props.dispatch(userAuth.loadpage(prm));
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
            optionyear: optionyear.sort((a, b) => b.value - a.value),
            submitted: false,
            screen_id: ScreenIDImportToJDE
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
        const self = this
        let apiRequest1 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/importtojde/ddlperiod`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ tempperiod: data })
                    return data
                });
        }, 350)
    }

    render() {
        const { erroryear, errorperiod } = this.state
        const { year, period, optionyear, optionperiod, tempperiod } = this.state
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
                                            <div className="form-group">
                                                <div className="col-md-6 form-group" >
                                                    <div className="col-md-4 control-label"><label > Year</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-4">
                                                        {optionyear &&
                                                            <Select options={optionyear} placeholder='Year' name="year" value={year} onChange={this.handleChangesYear} />
                                                        }
                                                        <span className="text-danger">{erroryear}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 form-group">
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-6 form-group" >
                                                    <div className="col-md-4 control-label"><label > Period (End Date)</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-4">
                                                        {tempperiod &&
                                                            <Select options={optionperiod} placeholder='Period' name="period" value={period} onChange={this.handleChangesPeriod} disabled={!year} />
                                                        }
                                                        <span className="text-danger">{errorperiod}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 form-group">
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-4 form-group" >
                                                </div>
                                                <div className="col-md-4 form-group" >
                                                </div>
                                                <div className="col-md-4 form-group">
                                                    <button className="btn btn-primary btn-default pull-right">
                                                        Process
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
    const { loadpage } = state;
    const screen_name = loadpage.screen_name
    const modify = loadpage.modify
    return {
        modify,
        screen_name
    };
}

const connectedImportToJDE = connect(mapStateToProps)(ImportToJDE);
export default connectedImportToJDE