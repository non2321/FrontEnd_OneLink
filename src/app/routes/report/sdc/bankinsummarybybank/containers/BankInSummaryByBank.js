import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../../actions/auth';
import { reportsdc } from '../../../../../actions/report'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../../components'
import { smallBox, bigBox, SmartMessageBox } from '../../../../../components/utils/actions/MessageActions'

import UiDatepicker from '../../../../../components/forms/inputs/UiDatepicker'
import { ScreenIDReportBankInSummaryByBank, PathBackEnd, TableauBankInSummaryByBank } from '../../../../../../../settings'
import { utils } from '../../../../../services'

import Delay from 'react-delay'

import Select from 'react-select'
import 'react-select/dist/react-select.css'

import TableauReport from 'react-tableau-report'

const optiontableau = {
    hideTabs: true,
    // hideToolbar: true
}

class BankInSummaryByBank extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportBankInSummaryByBank,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            datefrom: '',
            dateto: '',
            bank: '',
            errordatefrom: '',
            errordateto: '',
            errorbank: '',
            submitted: false,
            screen_id: ScreenIDReportBankInSummaryByBank
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

    handleChangesBank = (bank) => {
        this.setState({
            bank: (bank == null) ? '' : bank
        });
    }

    handleReset(e) {
        e.preventDefault();

        this.setState({ datefrom: '', dateto: '', bank: '', submitted: false, parameters: null })
        this.setState({ errordatefrom: '', errordateto: '', errorbank: '' })
    }

    handleSubmit(e) {
        e.preventDefault();

        const { dispatch } = this.props
        const { datefrom, dateto, bank, screen_id } = this.state
        const self = this

        this.setState({
            errordatefrom: (datefrom) ? '' : 'The From Date is required',
            errordateto: (dateto) ? '' : 'The To Date is required',
            errorbank: (bank) ? '' : 'The Bank is required',
            submitted: false
        })

        if (datefrom && dateto && bank && screen_id) {
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
                    'Bank Code': bank.value
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
            let response = await fetch(`${PathBackEnd}/api/report/bankall`)   
            let json = await response.json()             
            this.setState({
                optionbank: json
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
        const { datefrom, dateto, bank, optionbank, submitted, parameters } = this.state;
        const { errordatefrom, errordateto, errorbank } = this.state;
        const { modify, screen_name, report } = this.props;

        let tokentableau = report.data 

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
                                                    <UiDatepicker type="text" name="finishdate" id="finishdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" onInputChange={this.handleDateTo} value={dateto} disabled={!datefrom} placeholder="Finish date" />
                                                    <span className="text-danger">{errordateto}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > Bank</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionbank &&
                                                        <Select options={optionbank} placeholder='Bank' name="bank" value={bank} onChange={this.handleChangesBank} />
                                                    }
                                                    <span className="text-danger">{errorbank}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
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
                                                        url={TableauBankInSummaryByBank}
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

const connectedBankInSummaryByBank = connect(mapStateToProps)(BankInSummaryByBank);
export default connectedBankInSummaryByBank