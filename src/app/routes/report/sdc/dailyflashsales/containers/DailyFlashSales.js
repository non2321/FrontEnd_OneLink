import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../../actions/auth';
import { financialActions } from '../../../../../actions/sdc'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../../components'
import { smallBox, bigBox, SmartMessageBox } from '../../../../../components/utils/actions/MessageActions'

import UiDatepicker from '../../../../../components/forms/inputs/UiDatepicker'
import { ScreenIDReportDailyFlashSales, PathBackEnd } from '../../../../../../../settings'

import Delay from 'react-delay'

import Select from 'react-select'
import { Async } from 'react-select';
import 'react-select/dist/react-select.css';


const getOptionsStore = () => {
    return fetch(`${PathBackEnd}/api/report/storeall`)
        .then((response) => {
            return response.json();
        }).then((json) => {
            return { options: json };
        });
}

class DailyFlashSales extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportDailyFlashSales,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            stamp: 'option1',
            datefrom: '',
            dateto: '',
            from_store: '',
            to_store: '',
            formular_name: '',
            account_code: '',
            bu_type: '',
            type: '',
            subledger_type: '',
            subledger: '',
            submitted: false,
            screen_id: ScreenIDReportDailyFlashSales          
        }

        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)

        this.onStampChanged = this.onStampChanged.bind(this)

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
            from_store: (from_store == null)? '' : from_store, to_store: ''
         });
    }

    handleChangesToStore = (to_store) => {      
        this.setState({ to_store: (to_store == null)? '' : to_store });
    }

    onStampChanged(e) {
        this.setState({
            stamp: e.target.value
        });
    }

    handleReset(e) {
        e.preventDefault();

        this.setState({ datefrom: '', dateto: '', from_store: '', to_store: '', stamp: 'option1' })
    }

    handleSubmit(e) {
        e.preventDefault();
       
    }

    componentDidMount() {
        const self = this
        let apiRequest1 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/report/storeall`)
                .then(response => response.json())
                .then(data => {                  
                    self.setState({ options: data })
                    return data
                });
        }, 250)       
    }

    render() {
        const { stamp, datefrom, dateto, from_store, to_store, formular_name, account_code, bu_type, type, subledger_type, subledger, submitted, screen_id } = this.state;
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
                                    <fieldset>
                                        <div className="form-group">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > From Date</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="startdate" id="startdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="7" datefrom="#startdate" dateto="#finishdate" onInputChange={this.handleDateFrom} value={datefrom}
                                                        placeholder="Start date" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > To Date</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="finishdate" id="finishdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="7" onInputChange={this.handleDateTo} value={dateto} disabled={!datefrom} placeholder="Finish date" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > From Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">                                                  
                                                    <Select options={this.state.options}  placeholder='From Store' name="from_store" value={from_store} onChange={this.handleChangesFromStore}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > To Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">                                                    
                                                    <Select options={this.state.options.filter((option) => { return option.value >= parseInt(from_store.value)})}  disabled={!from_store} placeholder='To Store' name="to_store" value={to_store} onChange={this.handleChangesToStore}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label">
                                                    <label > File Type</label><span class="text-danger">*</span>
                                                </div>
                                                <div className="col-md-6 smart-form">
                                                    <section>
                                                        <div className="inline-group">
                                                            <label className="radio">
                                                                <input type="radio" name="radio-inline" value="option1" checked={stamp === 'option1'} onChange={this.onStampChanged} />
                                                                <i />Excel</label>
                                                            <label className="radio">
                                                                <input type="radio" name="radio-inline" value="option2" checked={stamp === 'option2'} onChange={this.onStampChanged} />
                                                                <i />PDF</label>
                                                        </div>
                                                    </section>
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
    const { loadpage } = state;
    const screen_name = loadpage.screen_name
    const modify = loadpage.modify
    return {
        modify,
        screen_name
    };
}

const connectedDailyFlashSales = connect(mapStateToProps)(DailyFlashSales);
export default connectedDailyFlashSales