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


import { ScreenIDBankInAdjustment, PathBackEnd } from '../../../../../../settings'


class BankInAdjustment extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDBankInAdjustment,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        this.state = {
            store_id: '',
            store_id_temp: '',
            store_name: '',
            submitted: false,
            daysOfStore: [],
            errorstore_id: '',
            errordatefrom: '',
            errordateto: '',
            datefrom: '',
            dateto: '',
            filename: 'Choose a file...',
            tabIndex: 0,
            validationstore: [],
            validationfinancialcode: [],
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
            screen_id: ScreenIDBankInAdjustment
        }

        this.handleChange = this.handleChange.bind(this)
        this.onChangeFile = this.onChangeFile.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)

        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)

        this.handleData = this.handleData.bind(this);
        this.handlePopSubmit = this.handlePopSubmit.bind(this)

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)

        this.handleUpload = this.handleUpload.bind(this)
        this.handleDownloadTemplate = this.handleDownloadTemplate.bind(this)

        this.handleGLDateFrom = this.handleGLDateFrom.bind(this)
        this.handleGLDateTo = this.handleGLDateTo.bind(this)
        this.handleGLSubmit = this.handleGLSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onChangeFile(e) {
        e.preventDefault()

        const self = this
        this.setState({ uploading: true })
        if (e.target.files.length > 0) {
            let namelength = e.target.files[0].name.length
            let name = ''
            if (namelength > 40) {
                name = `${e.target.files[0].name.substr(0, 40)}...`
            } else {
                name = e.target.files[0].name
            }
            this.setState({ file: e.target.files[0], filename: name })

            let files = e.target.files, file;
            if (!files || files.length == 0) return;
            file = files[0];
            let fileReader = new FileReader();

            let objectitem = []
            fileReader.onload = function (e) {

                // call 'xlsx' to read the file
                let workbook = XLSX.read(e.target.result, { type: 'buffer' });

                let sheet_name_list = workbook.SheetNames;

                sheet_name_list.forEach(function (y) { /* iterate through sheets */
                    let worksheet = workbook.Sheets[y];
                    worksheet['!ref'] = "A2:Z10000"
                    let tempitem = XLSX.utils.sheet_to_json(worksheet)
                    objectitem.push(tempitem)
                })
                let checkColumn = true
                if (objectitem[0][0]['Store ID'] === undefined) checkColumn = false
                if (objectitem[0][0]['Financial Code'] === undefined) checkColumn = false
                if (objectitem[0][0]['Financial Date'] === undefined) checkColumn = false
                if (objectitem[0][0]['Account Daily Fins'] === undefined) checkColumn = false

                if (checkColumn == true) {
                    for (let item in objectitem[0]) {
                        objectitem[0][item]['Status'] = ''
                    }

                    let data = {
                        "aaData": objectitem[0]
                    }
                    self.setState({ uploading: false, upload: data, obj: objectitem[0] })

                } else {

                    self.setState({ file: null, filename: 'Choose a file...', uploading: false, upload: null, obj: null })
                    self.props.dispatch(alertActions.error("File ไม่ถูกต้อง"))
                }
            };
            fileReader.readAsArrayBuffer(file)
            e.target.value = '';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let self = this
        const { dispatch } = this.props
        const { screen_id } = this.state

        const table = $('#table').DataTable()

        //check required
        let check_required = true
        table.rows().eq(0).each(function (index) {
            let inputStoreDailyFin = table.cell(index, 4).nodes().to$().find('input').val()
            let inputDailyFin = table.cell(index, 5).nodes().to$().find('input').val()

            if (inputStoreDailyFin.toString().trim() == '') {
                table.cell(index, 4).nodes().to$().find('label').text('required')
                check_required = false
            } else {
                table.cell(index, 4).nodes().to$().find('label').text('')
            }
            if (inputDailyFin.toString().trim() == '') {
                table.cell(index, 5).nodes().to$().find('label').text('required')
                check_required = false
            } else {
                table.cell(index, 5).nodes().to$().find('label').text('')
            }
        })

        if (check_required == true) {
            table.page.len(100).draw();

            this.setState({
                edit: false,
                submitted: true
            })

            let objectitem = []
            table.rows().eq(0).each(function (index) {
                let row = table.row(index)
                let data = row.data()

                let inputStoreDailyFin = table.cell(index, 4).nodes().to$().find('input').val()
                let inputDailyFin = table.cell(index, 5).nodes().to$().find('input').val()

                if (inputStoreDailyFin != parseFloat(Math.round(data['S_DAILY_FIN'] * 100) / 100).toFixed(2) || inputDailyFin != parseFloat(Math.round(data['DAILY_FIN'] * 100) / 100).toFixed(2)) {
                    const temp = { store_id: data['STORE'].toString(), fin_code: data['FINANCIAL_CODE'].toString(), fin_date: data['FINANCIAL_DATE'].toString(), store_daily_fin: inputStoreDailyFin, daily_fin: inputDailyFin, screen_id: screen_id }
                    objectitem.push(temp)
                }
            })
            $('input[type="number"]').prop('disabled', true);
            table.buttons().enable();
            dispatch(financialActions.editbankinadjustment(objectitem));
        }
    }

    handleCancel(e) {
        e.preventDefault();

        const table = $('#table').DataTable()
        table.page.len(100).draw();
        $('input[type="number"]').prop('disabled', true);
        this.setState({ edit: false })
        table.buttons().enable();
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

    handleData(data) {
        this.setState({
            fromChild: data
        });
    }

    handlePopSubmit(e) {
        e.preventDefault()
        const data = this.state.fromChild
        this.setState({ store_id: data['store_id'], store_name: data['store_name'], fromChild: '' })
        $('#myModalStore').modal('hide');
    }

    handleSearchSubmit(e) {
        e.preventDefault()
        const selft = this
        this.setState({ submitted: false, daysOfStore: [] })
        const { store_id, datefrom, dateto } = this.state

        this.setState({
            store_id_temp: store_id,
            errorstore_id: (store_id) ? '' : 'The store id is required',
            errordatefrom: (datefrom) ? '' : 'The Financial Date From is required',
            errordateto: (dateto) ? '' : 'The Financial Date To is required',
            submitted: false
        })

        if (store_id && datefrom && dateto) {

            let datePartsfrom = datefrom.split("/");
            let dateObjectfrom = new Date(datePartsfrom[2], datePartsfrom[1] - 1, datePartsfrom[0])

            let datePartsto = dateto.split("/");
            let dateObjectto = new Date(datePartsto[2], datePartsto[1] - 1, datePartsto[0])

            let days = [];
            for (let d = dateObjectfrom; d <= dateObjectto; d.setDate(d.getDate() + 1)) {
                days.push(new Date(d));
            }
            this.setState({ daysOfStore: days, tabIndex: 0 })
            setTimeout(function () {
                selft.setState({ submitted: true })
            }, 500)
        }
    }

    handleUpload(e) {
        e.preventDefault
        const self = this
        const { dispatch } = this.props
        const { screen_id, obj, validationstore, validationfinancialcode } = this.state

        this.setState({ uploading: true })
        setTimeout(function () {
            if (obj && screen_id) {

                let statusall = true
                for (let item in obj) {

                    obj[item]['Status'] = 'Success'
                    let status = true

                    const valstore = validationstore.find((x) => { return x.STORE_ID.toString().trim() == obj[item]['Store ID'].trim() })
                    const valfinancialcode = validationfinancialcode.find((x) => { return x.FINANCIAL_CODE.toString().trim() == obj[item]['Financial Code'].trim() })

                    if (valstore == undefined) status = false
                    if (valfinancialcode == undefined) status = false

                    if (obj[item]['Store ID'].trim() == '') status = false
                    if (obj[item]['Financial Code'].trim() == '') status = false
                    if (obj[item]['Financial Date'].trim() == '') status = false

                    let dt = utils.convertdateformat(obj[item]['Financial Date'])

                    if (Object.prototype.toString.call(dt) === "[object Date]") {
                        // it is a date
                        if (isNaN(dt.getTime())) {  // d.valueOf() could also work
                            status = false
                        }
                    }

                    if (obj[item]['Account Daily Fins'].trim() == '') status = false
                    let val = parseFloat(parseFloat(obj[item]['Account Daily Fins'].trim()))
                    if (isNaN(val)) status = false
                    if (status == true) {
                        obj[item]['Status'] = 'Success'
                    } else {
                        obj[item]['Status'] = 'Fail'
                        statusall = false
                    }
                }

                let data = {
                    "aaData": obj
                }

                if (statusall == true) {
                    dispatch(financialActions.importbankinadjustment(obj, screen_id));
                    self.setState({ uploading: false, upload: data, obj: null })
                } else {
                    self.setState({ uploading: false, upload: data, obj: null })
                }
            }
        }, 100)

    }

    handleDownloadTemplate(e) {
        e.preventDefault()
        financialActions.downloadtemplatebankin();
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
                glfrom_store: glfrom_store,
                glto_store: glto_store,
                screen_id: screen_id
            }
            dispatch(financialActions.glprocessbankinadjustment(prm));

            this.setState({
                glsubmitted: true
            })
        }
    }


    componentDidMount() {
        let self = this

        let apiRequest1 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/bankinadjustment/validationstore`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ validationstore: data })
                    return data
                });
        }, 250)

        let apiRequest2 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/bankinadjustment/validationfinancialcode`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ validationfinancialcode: data })
                    return data
                });
        }, 500)
    }

    render() {
        const { store_id, store_id_temp, store_name, datefrom, dateto, daysOfStore, submitted, edit } = this.state
        const { errorstore_id, errordatefrom, errordateto } = this.state
        const { gldoc_type, glledger_type, glfrom_date, glto_date, glfrom_store, glto_store, glsubmitted } = this.state
        const { errorgldoc_type, errorglledger_type, errorglfrom_date, errorglto_date, errorglfrom_store, errorglto_store } = this.state
        const { filename, upload, uploading, obj } = this.state

        const { modify, screen_name } = this.props;
        const self = this

        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2></header>
                                {modify && <div className="widget-body ">
                                    <br />
                                    <form onSubmit={this.handleSearchSubmit}>
                                        <div className="form-horizontal">
                                            <fieldset>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                        <div className="col-md-3 control-label"><label > Store ID</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-4">
                                                            <div class="input-group">
                                                                <span className="input-group-btn">
                                                                    <input type="text" name="store_id" value={store_id} onChange={this.handleChange} className="form-control" id="txtStoreId" placeholder="Store ID" disabled={true} />
                                                                    <a className="btn btn-primary" id="btn-chat" data-toggle="modal" data-target="#myModalStore">
                                                                        <i className="fa fa-user-md"></i>
                                                                    </a>
                                                                </span>
                                                            </div>
                                                            <span className="text-danger">{errorstore_id}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4 control-label"><label >Financial Date From</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <UiDatepicker type="text" name="startdate" id="startdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="7" datefrom="#startdate" dateto="#finishdate" onInputChange={this.handleDateFrom} value={datefrom}
                                                                placeholder="Start date" />
                                                            <span className="text-danger">{errordatefrom}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                        <div className="col-md-3 control-label"><label > Store Name</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <input type="text" name="store_name" value={store_name} onChange={this.handleChange} className="form-control" placeholder="Store Name" disabled={true} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4 control-label"><label >Financial Date To</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <UiDatepicker type="text" name="finishdate" id="finishdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="7" onInputChange={this.handleDateTo} value={dateto} disabled={!datefrom}
                                                                // datefrom="#startdate" dateto="#finishdate" 
                                                                placeholder="Finish date" />
                                                            <span className="text-danger">{errordateto}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-5">
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="btn-header transparent pull-right">
                                                                <button className="btn btn-primary btn-default">
                                                                    <i className="fa  fa-search"></i> Search
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>                                               
                                            </fieldset>
                                        </div>
                                        {submitted &&
                                            <div className="widget-body no-padding">
                                                <br />
                                                <hr />
                                                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex, edit: false })}>
                                                    <TabList>
                                                        {daysOfStore.map(function (days, index) {
                                                            const dt = dateFormat(days, "dd/mm/yyyy")
                                                            return <Tab>{dt}</Tab>
                                                        })}
                                                    </TabList>
                                                    {daysOfStore.map(function (days) {
                                                        const dt = dateFormat(days, "dd/mm/yyyy")
                                                        const dtforback = dateFormat(days, "yyyy-mm-dd")
                                                        return (
                                                            <TabPanel>
                                                                <div id={dt} >
                                                                    <DatatableBankInAdjustment
                                                                        options={{
                                                                            fixedHeader: true,
                                                                            ajax: `${PathBackEnd}/api/bankinadjustment/${store_id}/${dtforback}`,
                                                                            columns: [{ data: "FINANCIAL_CODE" }, { data: "FINANCIAL_DESC" },
                                                                            {
                                                                                data: "DAILY_FIN", "visible": false,
                                                                                render: function (data, type, row) {
                                                                                    return parseFloat(Math.round(data * 100) / 100).toFixed(2)
                                                                                }
                                                                            },
                                                                            {
                                                                                data: "S_DAILY_FIN", "visible": false,
                                                                                render: function (data, type, row) {
                                                                                    return parseFloat(Math.round(data * 100) / 100).toFixed(2)
                                                                                }
                                                                            },
                                                                            {
                                                                                data: "S_DAILY_FIN",
                                                                                render: function (data, type, row) {
                                                                                    return `<input type="number"  name="txtfinname" class="form-control input-xs" disabled="disabled" value=${parseFloat(Math.round(data * 100) / 100).toFixed(2)} step='0.01'><label class="text-danger"></label>`;
                                                                                }
                                                                            },
                                                                            {
                                                                                data: "DAILY_FIN",
                                                                                render: function (data, type, row) {
                                                                                    return `<input type="number"  name="txtfinname" class="form-control input-xs" disabled="disabled" value=${parseFloat(Math.round(data * 100) / 100).toFixed(2)} step='0.01'></div><label class="text-danger"></label>`;
                                                                                }
                                                                            }],
                                                                            buttons: [
                                                                                {
                                                                                    text: `<span ><i class="fa fa-edit" /><span class="hidden-mobile"> Edit</span></span>`,
                                                                                    className: `btn btn-primary btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                                                    action: function (e, dt, node, config) {
                                                                                        const table = $('#table').DataTable()
                                                                                        table.page.len(10000).draw();
                                                                                        table.buttons().disable();
                                                                                        table.rows().eq(0).each(function (index) {
                                                                                            let row = table.row(index)
                                                                                            let data = row.data()

                                                                                            if (data['CAN_EDIT'].toString() == "Y") {
                                                                                                let inputDailyFin = table.cell(index, 5).nodes().to$().find('input')
                                                                                                inputDailyFin.prop('disabled', false);
                                                                                            }
                                                                                        })
                                                                                        self.setState({ edit: true })
                                                                                    }
                                                                                },
                                                                                {
                                                                                    text: `<span ><i class="fa fa-mail-reply"  /><span class="hidden-mobile"> Import</span></span>`,
                                                                                    className: `btn btn-default btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                                                    action: function (e, dt, node, config) {
                                                                                        self.setState({ file: null, filename: 'Choose a file...', uploading: false, upload: null, obj: null })
                                                                                        $('#myModalUpload').modal('show')
                                                                                    }
                                                                                },
                                                                                {
                                                                                    extend: 'excel',
                                                                                    title: `Bankin_${store_id_temp}_${dtforback}`,
                                                                                    text: `<span ><i class="fa fa-mail-forward" /><span class="hidden-mobile"> Export</span></span>`,
                                                                                    className: `btn btn-default btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                                                    exportOptions: {
                                                                                        columns: [0, 1, 2, 3]
                                                                                    }
                                                                                },
                                                                                {
                                                                                    text: `<span ><i class="fa fa-mail-reply" /><span class="hidden-mobile"> Gen GL To E1</span></span>`,
                                                                                    className: `btn btn-default btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                                                    action: function (e, dt, node, config) {
                                                                                        self.setState({ gldoc_type: '', glledger_type: '', glfrom_date: '', glto_date: '', glfrom_store: '', glto_store: '' })
                                                                                        $('#myModalGL').modal('show')
                                                                                    }
                                                                                },
                                                                            ],
                                                                        }}
                                                                        paginationLength={true} className="table table-striped table-bordered table-hover"
                                                                        width="100%">
                                                                        <thead>
                                                                            <tr>
                                                                                <th data-class="expand"><i
                                                                                    className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                                    Financial Code
                                                                                    </th>
                                                                                <th data-hide="user"><i
                                                                                    className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                                    Financial Name
                                                                                    </th>
                                                                                <th data-hide="user"><i
                                                                                    className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                                    Store Daily Fins
                                                                                    </th>
                                                                                <th data-hide="user"><i
                                                                                    className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                                    Account Daily Fins
                                                                                    </th>
                                                                                <th data-hide="user"><i
                                                                                    className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                                    Store Daily Fins
                                                                                    </th>
                                                                                <th data-hide="user"><i
                                                                                    className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                                    Account Daily Fins
                                                                                    </th>
                                                                            </tr>
                                                                        </thead>
                                                                    </DatatableBankInAdjustment>
                                                                </div>
                                                                {edit &&
                                                                    <div className="smart-form">
                                                                        <footer>
                                                                            <button type="button" className="btn btn-primary btn-sm" onClick={self.handleSubmit}>
                                                                                <i className="fa fa-save"></i> Save
                                                                            </button>
                                                                            <button type="button" className="btn btn-default btn-sm" onClick={self.handleCancel}>
                                                                                Cancel
                                                                            </button>
                                                                        </footer>
                                                                    </div>
                                                                }
                                                            </TabPanel>
                                                        )
                                                    })}
                                                </Tabs>
                                            </div>
                                        }
                                    </form>
                                </div>
                                }
                            </JarvisWidget>
                        </article>
                    </div>
                    <div>
                        {/* Modal Upload */}
                        <div className="modal fade" id="myModalUpload" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                            &times;
                                            </button>
                                        <h4 className="modal-title" id="myModalLabel">Upload Excel</h4>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-3 form-group">
                                                    <label > Download Template</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <button type="button" className="btn btn-primary btn-sm " onClick={this.handleDownloadTemplate}>
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3 form-group">
                                                    <label > Import Excel</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    {/* <input type="file" name="file-1" id="file-1" class="inputfile inputfile-1" onChange={this.onChangeFile} />
                                                    <label for="file-1"><svg width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg><span>Choose a file&hellip;</span></label> */}
                                                    <input id="fileInput" type="file" name="file-1" id="file-1" class="inputfile inputfile-1" onChange={this.onChangeFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                                                    <label for="file-1" className="btn btn-primary btn-sm ">
                                                        &nbsp;Browse&nbsp;&nbsp;
                                                    </label>
                                                    <label >&nbsp;{filename}</label>
                                                    {uploading &&
                                                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="no-padding">
                                        {upload && uploading == false &&
                                            <PopupBankInAdjustmentUpload
                                                options={{
                                                    colReorder: true,
                                                    ajax: function (data, callback, settings) {
                                                        callback(
                                                            upload
                                                        )
                                                    },
                                                    columns: [{ data: "Store ID" }, { data: "Financial Code" }, { data: "Financial Date" }, { data: "Account Daily Fins" }, { data: "Status" }
                                                    ],
                                                }}
                                                paginationLength={true} className="table table-striped table-bordered table-hover"
                                                width="100%">
                                                <thead>
                                                    <tr>
                                                        <th data-hide="user"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Store ID
                                                    </th>
                                                        <th data-class="expand"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Financial Code
                                                    </th>
                                                        <th data-hide="user"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Financial Date
                                                    </th>
                                                        <th data-class="expand"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Account Daily Fins
                                                    </th>
                                                        <th data-class="expand"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Status
                                                    </th>
                                                    </tr>
                                                </thead>
                                            </PopupBankInAdjustmentUpload>
                                        }
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" type="submit" className="btn btn-primary" disabled={!obj} onClick={self.handleUpload}>
                                            Upload
                                        </button>
                                        <button type="button" className="btn btn-default" data-dismiss="modal">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Store */}
                        <div className="modal fade" id="myModalStore" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="true">
                            <form id="pop-form" onSubmit={this.handlePopSubmit}>
                                <div className="modal-dialog ">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                                &times;
                                            </button>
                                            <h4 className="modal-title" id="myModalLabel">{screen_name}</h4>
                                        </div>
                                        <div className="no-padding">
                                            {modify && <Delay wait={1000} >
                                                <PopupStore handlerFromParant={this.handleData}
                                                    options={{
                                                        colReorder: true,
                                                        ajax: `${PathBackEnd}/api/bankinadjustment/popupstore`,
                                                        columns: [{ data: "STORE_ID" }, { data: "STORE_NAME" }
                                                        ],
                                                    }}
                                                    paginationLength={true} className="table table-striped table-bordered table-hover"
                                                    width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th data-hide="user"><i
                                                                className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Code
                                                            </th>
                                                            <th data-class="expand"><i
                                                                className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                Store Name
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </PopupStore>
                                            </Delay>
                                            }
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" type="submit" className="btn btn-primary">
                                                Save
                                            </button>
                                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Generate GL To E1 */}
                        <div className="modal fade"
                            id="myModalGL" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="true">
                            <form id="pop-gl" >
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                                &times;
                                            </button>
                                            <h4 className="modal-title" id="myModalLabel">Generate GL To E1</h4>
                                        </div>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-md-6 form-group">
                                                        <div className="col-md-5 control-label"><label > Doc Type</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-7">
                                                            <input type="text" name="gldoc_type" value={gldoc_type} onChange={this.handleChange} className="form-control" placeholder="Doc Type" />
                                                            <span className="text-danger">{errorgldoc_type}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <div className="col-md-5 control-label"><label > Ledger Type</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-7">
                                                            <input type="text" name="glledger_type" value={glledger_type} onChange={this.handleChange} className="form-control" placeholder="Ledger Type" />
                                                            <span className="text-danger">{errorglledger_type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 form-group">
                                                        <div className="col-md-5 control-label"><label > From Date</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-7">
                                                            <UiDatepicker type="text" name="glfrom_date" id="glfrom_date" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" datefrom="#glfrom_date" dateto="#glto_date" onInputChange={this.handleGLDateFrom} value={glfrom_date}
                                                                placeholder="Start date" />
                                                            <span className="text-danger">{errorglfrom_date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <div className="col-md-5 control-label"><label > To Date</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-7">
                                                            <UiDatepicker type="text" name="glto_date" id="glto_date" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" onInputChange={this.handleGLDateTo} value={glto_date} disabled={!glfrom_date}
                                                                placeholder="Finish date" />
                                                            <span className="text-danger">{errorglto_date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 form-group">
                                                        <div className="col-md-5 control-label"><label > From Store</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-7">
                                                            <input type="text" name="glfrom_store" value={glfrom_store} onChange={this.handleChange} className="form-control" placeholder="From Store" />
                                                            <span className="text-danger">{errorglfrom_store}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <div className="col-md-5 control-label"><label > To Store</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-7">
                                                            <input type="text" name="glto_store" value={glto_store} onChange={this.handleChange} className="form-control" placeholder="To Store" />
                                                            <span className="text-danger">{errorglto_store}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-primary" onClick={this.handleGLSubmit} >
                                                Process
                                        </button>
                                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                                Cancel
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
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

const connectedBankInAdjustment = connect(mapStateToProps)(BankInAdjustment);
export default connectedBankInAdjustment