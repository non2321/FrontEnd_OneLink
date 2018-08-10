import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../../actions/auth';
import { reportsdc } from '../../../../../actions/report'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../../components'
import { smallBox, bigBox, SmartMessageBox } from '../../../../../components/utils/actions/MessageActions'

import UiDatepicker from '../../../../../components/forms/inputs/UiDatepicker'
import { ScreenIDReportCashSalesReconcilationByStore, PathBackEnd } from '../../../../../../../settings'

import Delay from 'react-delay'

import Select from 'react-select'
import 'react-select/dist/react-select.css';

import TableauReport from 'react-tableau-report'

class CashSalesReconcilationByStore extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportCashSalesReconcilationByStore,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            datefrom: '',
            dateto: '',
            store: '',
            errordatefrom: '',
            errordateto: '',
            errorstore: '',
            submitted: false,
            screen_id: ScreenIDReportCashSalesReconcilationByStore
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

    handleChangesStore = (store) => {
        this.setState({
            store: (store == null) ? '' : store
        });
    }   

    handleReset(e) {
        e.preventDefault();

        this.setState({ datefrom: '', dateto: '', store: '', submitted: false })
        this.setState({ errordatefrom: '', errordateto: '', errorstore: '' })
    }

    handleSubmit(e) {
        e.preventDefault();

        const { dispatch } = this.props
        const { datefrom, dateto, store, screen_id } = this.state
        const selft = this

        this.setState({
            errordatefrom: (datefrom) ? '' : 'The From Date is required',
            errordateto: (dateto) ? '' : 'The To Date is required',
            errorstore: (store) ? '' : 'The Store is required',
            submitted: false
        })

        // if (datefrom && dateto && from_store && to_store && screen_id) {
        //     let datePartsfrom = datefrom.split("/");
        //     let dateObjectfrom = `${datePartsfrom[2]}/${datePartsfrom[1]}/${datePartsfrom[0]}`

        //     let datePartsto = dateto.split("/");
        //     let dateObjectto = `${datePartsto[2]}/${datePartsto[1]}/${datePartsto[0]}`


        //     const prm = {
        //         datefrom: dateObjectfrom,
        //         dateto: dateObjectto,
        //         from_store: from_store.value,
        //         to_store: to_store.value,
        //         stamp: stamp,
        //         screen_id: screen_id
        //     }
        //     // dispatch(reportsdc.exportdailyflashsales(prm))            
        //     setTimeout(function () {
        //         selft.setState({ submitted: true })
        //     }, 500)
        // }
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
        }, 300)
    }

    render() {
        const { datefrom, dateto, store, optionstore, submitted } = this.state;
        const { errordatefrom, errordateto, errorstore } = this.state;
        const { modify, screen_name, report } = this.props;
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
                                        <div className="form-group">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > From Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionstore &&
                                                        <Select options={optionstore} placeholder='Store' name="store" value={store} onChange={this.handleChangesStore} />
                                                    }
                                                    <span className="text-danger">{errorstore}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label">
                                                </div>
                                                <div className="col-md-6">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
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
                                            <div className="col-md-12">
                                                {submitted && <TableauReport
                                                    url="http://public.tableau.com/views/RegionalSampleWorkbook/Storms"
                                                />
                                                }
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
    const { loadpage, report } = state;
    const screen_name = loadpage.screen_name
    const modify = loadpage.modify
    return {
        modify,
        screen_name,
        report
    };
}

const connectedCashSalesReconcilationByStore = connect(mapStateToProps)(CashSalesReconcilationByStore);
export default connectedCashSalesReconcilationByStore