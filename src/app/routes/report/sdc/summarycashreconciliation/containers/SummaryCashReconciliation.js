import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../../actions/auth';
import { reportsdc } from '../../../../../actions/report'

import { WidgetGrid, JarvisWidget } from '../../../../../components'

import UiDatepicker from '../../../../../components/forms/inputs/UiDatepicker'
import { ScreenIDReportSummaryCashReconciliation, PathBackEnd, TableauReportSummaryCashReconciliation } from '../../../../../../../settings'
import { utils } from '../../../../../services'

import Select from 'react-select'
import 'react-select/dist/react-select.css';

import TableauReport from 'react-tableau-report'

const optiontableau = {
    hideTabs: true,
    // hideToolbar: true
}

class SummaryCashReconciliation extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportSummaryCashReconciliation,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            datefrom: '',
            dateto: '',
            from_store: '',
            to_store: '',
            errordatefrom: '',
            errordateto: '',
            errorfrom_store: '',
            errorto_store: '',
            submitted: false,
            screen_id: ScreenIDReportSummaryCashReconciliation
        }

        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)

        this.handleReset = this.handleReset.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    handleChangesFromStore = (from_store) => {
        this.setState({
            from_store: (from_store == null) ? '' : from_store, to_store: '',
            to_store: (from_store == null) ? '' : from_store
        });
    }

    handleChangesToStore = (to_store) => {
        this.setState({ to_store: (to_store == null) ? '' : to_store });
    }

    handleReset(e) {
        e.preventDefault();

        this.setState({ datefrom: '', dateto: '', from_store: '', to_store: '', submitted: false, parameters: null })
        this.setState({ errordatefrom: '', errordateto: '', errorfrom_store: '', errorto_store: '' })
    }

    handleSubmit(e) {
        e.preventDefault();

        const { dispatch } = this.props
        const { datefrom, dateto, from_store, to_store, screen_id } = this.state
        const self = this

        this.setState({
            errordatefrom: (datefrom) ? '' : 'The From Date is required',
            errordateto: (dateto) ? '' : 'The To Date is required',
            errorfrom_store: (from_store) ? '' : 'The From Store is required',
            errorto_store: (to_store) ? '' : 'The To Store To is required',
            submitted: false
        })

        if (datefrom && dateto && from_store && to_store && screen_id) {
            const dateObjectfrom = utils.convertdateformatString(datefrom)
            const dateObjectto = utils.convertdateformatString(dateto)

            const prm = {
                screen_id: screen_id
            }
            dispatch(reportsdc.generatetokentableau(prm))
            this.setState({
                parameters: {                  
                    'Financial Date From': dateObjectfrom,
                    'Financial Date To': dateObjectto,
                    'Store From': from_store.value,
                    'Store To': to_store.value
                }
            })

            setTimeout(function () {
                self.setState({ submitted: true })
            }, 500)
        }
    }

    async componentDidMount() {
        const { screen_id } = this.state 
        const { dispatch } = this.props

        const self = this
        setTimeout(async () => {
            let response = await fetch(`${PathBackEnd}/api/report/storeall`)   
            let json = await response.json()             
            this.setState({
                optionstore: json
            })
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
        const { datefrom, dateto, from_store, to_store, optionstore, submitted, parameters } = this.state;
        const { errordatefrom, errordateto, errorfrom_store, errorto_store } = this.state;
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
                                                <div className="col-md-4 control-label"><label > From Date</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="startdate" id="startdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" datefrom="#startdate" dateto="#finishdate" onInputChange={this.handleDateFrom} value={datefrom}
                                                        placeholder="Start date" />
                                                    <span className="text-danger">{errordatefrom}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > To Date</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="finishdate" id="finishdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="7" onInputChange={this.handleDateTo} value={dateto} disabled={!datefrom} placeholder="Finish date" />
                                                    <span className="text-danger">{errordateto}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > From Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionstore &&
                                                        <Select options={optionstore} placeholder='From Store' name="from_store" value={from_store} onChange={this.handleChangesFromStore} />
                                                    }
                                                    <span className="text-danger">{errorfrom_store}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > To Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionstore &&
                                                        <Select options={optionstore.filter((option) => { return option.value >= parseInt(from_store.value) })} disabled={!from_store} placeholder='To Store' name="to_store" value={to_store} onChange={this.handleChangesToStore} />
                                                    }
                                                    <span className="text-danger">{errorto_store}</span>
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
                                                       url={TableauReportSummaryCashReconciliation}
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

const connectedSummaryCashReconciliation = connect(mapStateToProps)(SummaryCashReconciliation);
export default connectedSummaryCashReconciliation