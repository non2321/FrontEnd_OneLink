import React from 'react'
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch'
import 'react-tabs/style/react-tabs.css';

import Select from 'react-select'
import 'react-select/dist/react-select.css'

import { userAuth } from '../../../../actions/auth';
import { financialActions } from '../../../../actions/sdc'

import { WidgetGrid, JarvisWidget } from '../../../../components'
import UiDatepicker from '../../../../components/forms/inputs/UiDatepicker'

import { ScreenIDGenerateG1ToE1, PathBackEnd } from '../../../../../../settings'


class GenerateG1ToE1 extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDGenerateG1ToE1,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            datefrom: '',
            dateto: '',
            gldoc_type: '',
            glledger_type: '',
            glfrom_date: '',
            glto_date: '',
            glfrom_store: '',
            glto_store: '',
            errorgldoc_type: '',
            errorglledger_type: '',
            errorglfrom_date: '',
            errorglto_date: '',
            errorglfrom_store: '',
            errorglto_store: '',
            glsubmitted: false,
            screen_id: ScreenIDGenerateG1ToE1
        }

        this.handleChange = this.handleChange.bind(this)

        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)    

        this.handleGLDateFrom = this.handleGLDateFrom.bind(this)
        this.handleGLDateTo = this.handleGLDateTo.bind(this)
        this.handleGLSubmit = this.handleGLSubmit.bind(this)
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


    handleGLDateFrom(data) {
        this.setState({
            glfrom_date: data, glto_date: data
        });
    }

    handleGLDateTo(data) {
        this.setState({
            glto_date: data
        });
    }

    handleGLSubmit(e) {
        e.preventDefault()

        const { dispatch } = this.props
        const { gldoc_type, glledger_type, glfrom_date, glto_date, glfrom_store, glto_store, screen_id } = this.state
        
        this.setState({
            errorgldoc_type: (gldoc_type) ? '' : 'The doc type is required',
            errorglledger_type: (glledger_type) ? '' : 'The ledger type is required',
            errorglfrom_date: (glfrom_date) ? '' : 'The from date is required',
            errorglto_date: (glto_date) ? '' : 'The to date is required',
            errorglfrom_store: (glfrom_store) ? '' : 'The from store is required',
            errorglto_store: (glto_store) ? '' : 'The to store is required',
            glsubmitted: false
        })

        if (gldoc_type && glledger_type && glfrom_date && glto_date && glfrom_store && glto_store && screen_id) {
            const prm = {
                gldoc_type: gldoc_type,
                glledger_type: glledger_type,
                glfrom_date: glfrom_date,
                glto_date: glto_date,
                glfrom_store: glfrom_store.value.toString(),
                glto_store: glto_store.value.toString(),
                screen_id: screen_id
            }
            dispatch(financialActions.glprocessbankinadjustment(prm));

            this.setState({
                glsubmitted: true
            })
        }
    }

    handleChangesGLFromStore = (glfrom_store) => {
        this.setState({
            glfrom_store: (glfrom_store == null) ? '' : glfrom_store, glto_store: '',
            glto_store: (glfrom_store == null) ? '' : glfrom_store
        });
    }

    handleChangesGLToStore = (glto_store) => {
        this.setState({ glto_store: (glto_store == null) ? '' : glto_store });
    }

    handleGenGL = () => {
        this.setState({
            gldoc_type: '',
            glledger_type: '',
            glfrom_date: '',
            glto_date: '',
            glfrom_store: '',
            glto_store: ''
        })
    }


    async componentDidMount() {
        try {            
            setTimeout(async () => {
                let response = await fetch(`${PathBackEnd}/api/report/storeall`)
                let json = await response.json()
                this.setState({
                    optionstore: json
                })
            }, 500)
        }
        catch (err) {
            console.log(err);
        }
    }

    render() {
        const { optionstore } = this.state
        const { gldoc_type, glledger_type, glfrom_date, glto_date, glfrom_store, glto_store } = this.state
        const { errorgldoc_type, errorglledger_type, errorglfrom_date, errorglto_date, errorglfrom_store, errorglto_store } = this.state
       
        const { modify, screen_name } = this.props;
        const self = this

        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken" custombutton={true}>
                                <header>
                                    <h2>{screen_name}</h2>
                                </header>
                                {modify && <div className="widget-body ">
                                    <br />
                                    <div className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > Doc Type</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <input type="text" name="gldoc_type" value={gldoc_type} onChange={this.handleChange} className="form-control" placeholder="Doc Type" />
                                                    <span className="text-danger">{errorgldoc_type}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > Ledger Type</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <input type="text" name="glledger_type" value={glledger_type} onChange={this.handleChange} className="form-control" placeholder="Ledger Type" />
                                                    <span className="text-danger">{errorglledger_type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > From Date</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="glfrom_date" id="glfrom_date" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" datefrom="#glfrom_date" dateto="#glto_date" onInputChange={this.handleGLDateFrom} value={glfrom_date}
                                                        placeholder="Start date" />
                                                    <span className="text-danger">{errorglfrom_date}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > To Date</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    <UiDatepicker type="text" name="glto_date" id="glto_date" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" onInputChange={this.handleGLDateTo} value={glto_date} disabled={!glfrom_date}
                                                        placeholder="Finish date" />
                                                    <span className="text-danger">{errorglto_date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > From Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionstore &&
                                                        <Select options={optionstore} placeholder='From Store' name="glfrom_store" value={glfrom_store} onChange={this.handleChangesGLFromStore} />
                                                    }
                                                    {/* <input type="text" name="glfrom_store" value={glfrom_store} onChange={this.handleChange} className="form-control" placeholder="From Store" /> */}
                                                    <span className="text-danger">{errorglfrom_store}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <div className="col-md-4 control-label"><label > To Store</label><span class="text-danger">*</span></div>
                                                <div className="col-md-6">
                                                    {optionstore &&
                                                        <Select options={optionstore.filter((option) => { return option.value >= parseInt(glfrom_store.value) })} disabled={!glfrom_store} placeholder='To Store' name="glto_store" value={glto_store} onChange={this.handleChangesGLToStore} />
                                                    }
                                                    {/* <input type="text" name="glto_store" value={glto_store} onChange={this.handleChange} className="form-control" placeholder="To Store" /> */}
                                                    <span className="text-danger">{errorglto_store}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="modal-footer">
                                        <button id="btnGengl" type="button" className="btn btn-primary" onClick={this.handleGLSubmit} data-loading-text="<i class='fa fa-spinner fa-spin '></i> Processing">
                                            Process
                                        </button>
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

const connectedGenerateG1ToE1 = connect(mapStateToProps)(GenerateG1ToE1);
export default connectedGenerateG1ToE1