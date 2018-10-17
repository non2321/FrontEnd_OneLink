import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../../actions/auth';
import { reportsdc } from '../../../../../actions/report'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../../components'
import { smallBox, bigBox, SmartMessageBox } from '../../../../../components/utils/actions/MessageActions'

import UiDatepicker from '../../../../../components/forms/inputs/UiDatepicker'
import { ScreenIDReportRestaurantPettyCashAnanlysis, PathBackEnd, TableauReportRestaurantPettyCashAnanlysis } from '../../../../../../../settings'
import { utils } from '../../../../../services'

import Select from 'react-select'
import 'react-select/dist/react-select.css';

import TableauReport from 'react-tableau-report'

const optiontableau = {
    hideTabs: true,
    // hideToolbar: true
}

class RestaurantPettyCashAnanlysis extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportRestaurantPettyCashAnanlysis,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            datefrom: '',           
            store: '',
            errordatefrom: '',         
            errorstore: '',
            submitted: false,
            screen_id: ScreenIDReportRestaurantPettyCashAnanlysis
        }

        this.handleDateFrom = this.handleDateFrom.bind(this)    

        this.handleReset = this.handleReset.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleDateFrom(data) {
        this.setState({
            datefrom: data, dateto: data
        });
    }
    
    handleChangesStore = (store) => {
        this.setState({
            store: (store == null) ? '' : store
        });
    }

    handleReset(e) {
        e.preventDefault();

        this.setState({ datefrom: '', store: '', submitted: false, parameters: null })
        this.setState({ errordatefrom: '', errorstore: '' })
    }

    handleSubmit(e) {
        e.preventDefault();

        const { dispatch } = this.props
        const { datefrom, dateto, store, screen_id } = this.state
        const self = this

        this.setState({
            errordatefrom: (datefrom) ? '' : 'The Date is required',         
            errorstore: (store) ? '' : 'The Store is required',
            submitted: false
        })

        if (datefrom && store && screen_id) {
            const dateObjectto = utils.convertdateformatString(datefrom)           

            const prm = {
                screen_id: screen_id
            }
            dispatch(reportsdc.generatetokentableau(prm))
            this.setState({
                parameters: {
                    'Financial Date To': dateObjectto,
                    'Store From': store.value
                }
            })

            setTimeout(function () {
                self.setState({ submitted: true })
            }, 500)
        }
    }

    componentDidMount() {
        const self = this
        let apiRequest1 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/report/storeall`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ optionstore: data })
                    return data
                });
        }, 500)
    }

    render() {
        const { datefrom, store, optionstore, submitted, parameters } = this.state;
        const { errordatefrom, errorstore } = this.state;
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
                                                <div className="col-md-4 control-label"><label > Date</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="startdate" id="startdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" datefrom="#startdate" dateto="#finishdate" onInputChange={this.handleDateFrom} value={datefrom}
                                                        placeholder="Start date" />
                                                    <span className="text-danger">{errordatefrom}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionstore &&
                                                        <Select options={optionstore} placeholder='Store' name="store" value={store} onChange={this.handleChangesStore} />
                                                    }
                                                    <span className="text-danger">{errorstore}</span>
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
                                                       url={TableauReportRestaurantPettyCashAnanlysis}
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

const connectedRestaurantPettyCashAnanlysis = connect(mapStateToProps)(RestaurantPettyCashAnanlysis);
export default connectedRestaurantPettyCashAnanlysis