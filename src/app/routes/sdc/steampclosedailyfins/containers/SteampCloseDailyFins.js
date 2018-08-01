import React from 'react'
import { connect } from 'react-redux';
import Delay from 'react-delay'
import XLSX from 'xlsx';
import fetch from 'isomorphic-fetch'
import dateFormat from 'dateformat';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { userAuth } from '../../../../actions/auth';
import { financialActions } from '../../../../actions/sdc'
import { alertActions } from '../../../../actions/alert/alert.actions';

import { WidgetGrid, JarvisWidget } from '../../../../components'
import DatatableBankInAdjustment from '../../../../components/tables/DatatableBankInAdjustment'
import UiDatepicker from '../../../../components/forms/inputs/UiDatepicker'
import PopupStore from '../../../../components/tables-popup/PopupStore'
import PopupBankInAdjustmentUpload from '../../../../components/tables-popup/PopupBankInAdjustmentUpload'
import { utils } from '../../../../services'

import { ScreenIDSteampCloseDailyFins, PathBackEnd } from '../../../../../../settings'


class SteampCloseDailyFins extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDSteampCloseDailyFins,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            stamp: 'option1',
            datefrom: '',
            dateto: '',
            errordatefrom: '',
            errordateto: '',
            submitted: false,
            screen_id: ScreenIDSteampCloseDailyFins
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)
        this.onStampChanged = this.onStampChanged.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    onStampChanged(e) {       
        this.setState({
            stamp: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault()
        const { dispatch } = this.props
        this.setState({ submitted: false })
        const { stamp, datefrom, dateto, screen_id } = this.state

        this.setState({
            errordatefrom: (datefrom) ? '' : 'The Financial Date From is required',
            errordateto: (dateto) ? '' : 'The Financial Date To is required',
            submitted: false
        })

        if (stamp && datefrom && dateto) {
            const prm = {
                stamp: stamp,
                datefrom: utils.convertdateformatString(datefrom),
                dateto: utils.convertdateformatString(dateto),
                screen_id: screen_id
            }
            dispatch(financialActions.stampclosedailyfins(prm));

            this.setState({ submitted: true })

        }
    }

    componentDidUpdate() {
        const { alert } = this.props
        if (alert.type == 'bigalert-success') {
            $('#ModalAlert').modal('show');
            this.setState({ alertall: { title: 'Alert Success', content: (alert.message == "") ? "Success" : alert.message } })
            this.props.dispatch(alertActions.clear());
        }
        if (alert.type == 'bigalert-danger') {
            $('#ModalAlert').modal('show');
            this.setState({ alertall: { title: 'Alert Error', content: (alert.message == "") ? "Can't receive message from SQL Server" : alert.message } })
            this.props.dispatch(alertActions.clear());
        }
    }


    render() {
        const { stamp, datefrom, dateto, alertall } = this.state
        const { errordatefrom, errordateto } = this.state
        const { modify, screen_name } = this.props;

        // $('#ModalAlert').modal({ show: true });
        // $('#ModalAlert').modal('show');

        // if (alert.type == 'bigalert-success') {
        //     $('#myModal').modal('show')
        // }
        //    if(alert.type == 'bigalert-success') {

        //   $('#ModalAlert').modal({ show: true });
        // }

        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2></header>
                                {modify && <div className="widget-body ">
                                    <br />
                                    {/* <form > */}
                                    <div className="form-group">
                                        <div className="row form-group">
                                            <div className="col-md-6">
                                                <div className="smart-form">
                                                    <section>
                                                        <div className="inline-group">
                                                            <label className="radio">
                                                                <input type="radio" name="radio-inline" value="option1" checked={stamp === 'option1'} onChange={this.onStampChanged} />
                                                                <i />Stamp Close Data</label>
                                                            <label className="radio">
                                                                <input type="radio" name="radio-inline" value="option2" checked={stamp === 'option2'} onChange={this.onStampChanged} />
                                                                <i />Re Close Data</label>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="col-md-4 control-label"><label > Financial Date From</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="datefrom" id="datefrom" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy"
                                                        addday="120" datefrom="#datefrom" dateto="#dateto" onInputChange={this.handleDateFrom} value={datefrom}
                                                        placeholder="Start date" />
                                                    <span className="text-danger">{errordatefrom}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > Financial Date To</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="dateto" id="dateto" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy"
                                                        onInputChange={this.handleDateTo} value={dateto} disabled={!dateto}
                                                        placeholder="Finish date" />
                                                    <span className="text-danger">{errordateto}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                            </div>
                                            <div className="col-md-6">
                                                <div className="col-md-6">
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="btn-header transparent pull-right">
                                                        <button className="btn btn-primary btn-default" onClick={this.handleSubmit}>
                                                            <i className="fa  fa-file-text"></i> Stamp
                                                                </button>
                                                    </div>                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* </form> */}
                                </div>
                                }
                            </JarvisWidget>
                        </article>
                    </div>
                    <div className="modal fade" id="ModalAlert" role="dialog" aria-labelledby="myModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog">
                            {alertall && <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                        &times;
                                    </button>
                                    <h4 className="modal-title" id="myModalLabel">{alertall.title}</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        {alertall.content}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">
                                        Cancel
                            </button>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </WidgetGrid>


            </div>
        )
    }
}


function mapStateToProps(state) {
    const { loadpage, alert } = state;
    const screen_name = loadpage.screen_name
    const modify = loadpage.modify
    return {
        alert,
        modify,
        screen_name
    };
}

const connectedSteampCloseDailyFins = connect(mapStateToProps)(SteampCloseDailyFins);
export default connectedSteampCloseDailyFins