import React from 'react'
import { connect } from 'react-redux'
import Delay from 'react-delay'
import XLSX from 'xlsx';
import fetch from 'isomorphic-fetch'

import { userAuth } from '../../../../actions/auth'
import { inventoryActions } from '../../../../actions/sdc'
import { alertActions } from '../../../../actions/alert/alert.actions';

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import PopupBankInAdjustmentUpload from '../../../../components/tables-popup/PopupBankInAdjustmentUpload'

import { ScreenIDUnitCost, PathBackEnd, DropdownMonth } from '../../../../../../settings'

import DatatableUnitCost from '../../../../components/tables/DatatableUnitCost'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

class EndingInventory extends React.Component {
    constructor(props) {
        super(props)
        const self = this

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDUnitCost,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        const datenow = new Date()
        const monthnow = datenow.getMonth()
        const yearnow = datenow.getFullYear()
        let optionyear = []
        const yearago = yearnow - 10
        for (let year = yearago; year <= yearnow; year++) {
            const item = { "value": year, "label": year }
            optionyear.push(item)
        }

        this.state = {
            month: monthnow,
            year: yearnow,
            optionyear: optionyear.sort((a, b) => b.value - a.value),
            submitted: false,
            screen_id: ScreenIDUnitCost
        }

        this.handleChange = this.handleChange.bind(this)
        this.onChangeFile = this.onChangeFile.bind(this)

        this.handleData = this.handleData.bind(this)
        this.handlePopSubmit = this.handlePopSubmit.bind(this)

        this.handleUpload = this.handleUpload.bind(this)
        this.handleDownloadTemplate = this.handleDownloadTemplate.bind(this)

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)

        this.handleGenSubmit = this.handleGenSubmit.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value })
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

                if (objectitem[0].length > 0) {
                    if (objectitem[0][0]['Period'] === undefined) checkColumn = false
                    if (objectitem[0][0]['Stock No'] === undefined) checkColumn = false
                    if (objectitem[0][0]['Inv Item'] === undefined) checkColumn = false
                    if (objectitem[0][0]['Unit Cost'] === undefined) checkColumn = false
                    if (objectitem[0][0]['Unit'] === undefined) checkColumn = false

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
                        self.props.dispatch(alertActions.error("File incorrect."))
                    }
                } else {
                    self.setState({ file: null, filename: 'Choose a file...', uploading: false, upload: null, obj: null })
                    self.props.dispatch(alertActions.warning("Data not found."))
                }

            }
            fileReader.readAsArrayBuffer(file)
            e.target.value = '';
        }
    }

    handleData(data) {
        this.setState({
            fromChild: data
        })
    }

    handlePopSubmit(e) {
        e.preventDefault()
        const data = this.state.fromChild
        this.setState({ store_id: data['store_id'], store_name: data['store_name'], fromChild: '' })
        $('#myModalStore').modal('hide')
    }

    handleChangesMonth = (month) => {
        const { year, period } = this.state
        const self = this

        this.setState({
            month: (month == null) ? '' : month,
            period: (month == null) ? '' : period
        })
        if (month && year) {
            const prm_year = (year.value) ? year.value : year
            const prm_month = (month.value) ? month.value : month

            const apiRequest = setTimeout(function () {
                fetch(`${PathBackEnd}/api/endinginventory/getperiod/${prm_year}/${prm_month}`)
                    .then(response => response.json())
                    .then(data => {
                        self.setState({ period: data[0].value })
                        return data
                    });
            }, 200)
        }
    }

    handleChangesYear = (year) => {
        const { month, period } = this.state
        const self = this

        this.setState({
            year: (year == null) ? '' : year,
            period: (year == null) ? '' : period
        })

        if (month && year) {
            const prm_year = (year.value) ? year.value : year
            const prm_month = (month.value) ? month.value : month

            const apiRequest = setTimeout(function () {
                fetch(`${PathBackEnd}/api/endinginventory/getperiod/${prm_year}/${prm_month}`)
                    .then(response => response.json())
                    .then(data => {
                        self.setState({ period: data[0].value })
                        return data
                    });
            }, 200)
        }
    }

    handleChangesYearGenInven = (yeargeninven) => {
        const { tempperiod } = this.state
        
        this.setState({
            yeargeninven: (yeargeninven == null) ? '' : yeargeninven,
            periodgeninven: '',
            optionperiod: (yeargeninven == null) ? '' : tempperiod.filter((task) => task.year == yeargeninven.value)
        })
    }

    handleChangesPeriodGenInven = (periodgeninven) => {
        this.setState({
            periodgeninven: (periodgeninven == null) ? '' : periodgeninven
        })
    }

    handleSearchSubmit(e) {
        e.preventDefault()
        const self = this
        const { period, invencategory, stockno } = this.state

        this.setState({
            errorperiod: (period) ? '' : 'The period is required',
            submitted: false
        })

        if (period) {
            setTimeout(() => {
                self.setState({
                    dataperiod: period,
                    datainvencategory: (invencategory) ? invencategory.value : undefined,
                    datastockno: stockno,
                    submitted: true
                })
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
                let period = ''
                for (let item in obj) {

                    obj[item]['Status'] = 'Success'
                    let status = true

                    if (obj[item]['Period'].trim() == '') status = false
                    if (obj[item]['Stock No'].trim() == '') status = false
                    if (obj[item]['Inv Item'].trim() == '') status = false
                    if (obj[item]['Unit Cost'].trim() == '') status = false
                    if (obj[item]['Unit'].trim() == '') status = false

                    if (item == 0) {
                        period = obj[item]['Period'].trim()
                    }

                    if (obj[item]['Period'].trim() != period) status = false

                    let checkduplicate = 0
                    for (let subitem in obj) {
                        if (obj[item]['Inv Item'].trim() == obj[subitem]['Inv Item'].trim()) {
                            checkduplicate = checkduplicate + 1
                        }
                    }
                    if (checkduplicate > 1) status = false

                    if (obj[item]['Unit Cost'].trim() == '') status = false
                    let valUnitCost = parseFloat(parseFloat(obj[item]['Unit Cost'].trim()))
                    if (isNaN(valUnitCost)) status = false

                    if (obj[item]['Unit'].trim() == '') status = false
                    let valUnit = parseFloat(parseFloat(obj[item]['Unit'].trim()))
                    if (isNaN(valUnit)) status = false



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
                    dispatch(inventoryActions.importunitcost(obj, screen_id));
                    self.setState({ uploading: false, upload: data, obj: null })
                } else {
                    self.setState({ uploading: false, upload: data, obj: null })
                }
            }
        }, 100)
    }

    handleDownloadTemplate(e) {
        e.preventDefault()
        inventoryActions.downloadtemplateunitcost();
    }

    handleGenPHInventory = () => {
        this.setState({
            yeargeninven: '',
            periodgeninven: ''
        })
    }

    handleImport = () => {
        this.setState({
            filename: '',
            obj: null,
            upload: null
        })
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
            let inputUnitCost = table.cell(index, 4).nodes().to$().find('input').val()
            let inputCountUnit = table.cell(index, 5).nodes().to$().find('input').val()

            if (inputUnitCost.toString().trim() == '') {
                table.cell(index, 4).nodes().to$().find('label').text('required')
                check_required = false
            } else {
                table.cell(index, 4).nodes().to$().find('label').text('')
            }
            if (inputCountUnit.toString().trim() == '') {
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

                let inputUnitCost = table.cell(index, 4).nodes().to$().find('input').val()
                let inputCountUnit = table.cell(index, 5).nodes().to$().find('input').val()

                if (inputUnitCost != parseFloat(Math.round(data['UNIT_COST'] * 100) / 100).toFixed(2) || inputCountUnit != parseFloat(Math.round(data['COUNT_PER_UNIT'] * 100) / 100).toFixed(2)) {
                    const temp = { period: data['PERIOD_ID'].toString(), inv_item: data['INV_ITEM'].toString(), unitcost: inputUnitCost, countunit: inputCountUnit, screen_id: screen_id }
                    objectitem.push(temp)
                }
            })
            $('input[type="number"]').prop('disabled', true);
            table.buttons().enable();
            dispatch(inventoryActions.editunitcost(objectitem));
        }
    }

    handleCancel(e) {
        e.preventDefault();

        const table = $('#table').DataTable()
        table.page.len(10).draw();
        $('input[type="number"]').prop('disabled', true);
        this.setState({ edit: false })
        table.buttons().enable();
    }

    handleChangesInven_category = (invencategory) => {
        this.setState({
            invencategory: (invencategory == null) ? '' : invencategory
        });
    }

    handleGenSubmit(e) {
        e.preventDefault()

        const { dispatch } = this.props
        const { yeargeninven, periodgeninven, screen_id } = this.state
       
        this.setState({
            erroryeargeninven: (yeargeninven) ? '' : 'The year is required',
            errorperiodgeninven: (periodgeninven) ? '' : 'The period is required',          
            gensubmitted: false
        })

        if (periodgeninven && screen_id) {
            const prm = {
                period: periodgeninven.value,               
                screen_id: screen_id
            }
            dispatch(inventoryActions.genunitcost(prm))
            
            this.setState({
                gensubmitted: true
            })
        }
    }

    componentDidMount() {
        const { year, month } = this.state
        const self = this

        let apiRequest1 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/unitcost/ddlinvencategory`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ optioninven_category: data })
                    return data
                });
        }, 300)

        let apiRequest2 = setTimeout(function () {
            fetch(`${PathBackEnd}/api/importtojde/ddlperiod`)
                .then(response => response.json())
                .then(data => {
                    self.setState({ tempperiod: data })
                    return data
                });
        }, 600)

        if (month && year) {

            const prm_year = (year.value) ? year.value : year
            const prm_month = (month.value) ? month.value : month
            const apiRequest = setTimeout(function () {
                fetch(`${PathBackEnd}/api/endinginventory/getperiod/${prm_year}/${prm_month}`)
                    .then(response => response.json())
                    .then(data => {
                        self.setState({ period: data[0].value })
                        return data
                    });
            }, 800)
        }       
    }


    render() {
        const { erroryear, errormonth, errorperiod, errorinvencategory, errorstockno, errorperiodgeninven, erroryeargeninven } = this.state
        const { year, month, period, invencategory, stockno, optionyear, submitted, edit, periodgeninven, yeargeninven } = this.state
        const { optioninven_category, optionperiod, tempperiod } = this.state
        const { dataperiod, datainvencategory, datastockno } = this.state
        const { obj, filename, upload, uploading } = this.state
        const { modify, screen_name } = this.props;
        const self = this


        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2>
                                    {modify && modify.can_edit == "Y" && <div className="jarviswidget-ctrls" >
                                        <a style={{ "padding-left": "10px", "padding-right": "10px" }} onClick={this.handleImport} title="Import" className="button-icon form-group" data-toggle="modal" data-target="#myModalUpload">
                                            <span > Import</span></a>
                                        <a style={{ "padding-left": "10px", "padding-right": "10px" }} onClick={this.handleGenPHInventory} title="Gen GL To E1" className="button-icon form-group" data-toggle="modal" data-target="#myModalGenPHInventory">
                                            <span > Gen </span><span class="hidden-mobile">PH Inventory To E1</span></a>
                                    </div>
                                    }
                                </header>
                                {modify && <div className="widget-body ">
                                    <br />
                                    <form onSubmit={this.handleSearchSubmit}>
                                        <div className="form-horizontal">
                                            <div className="form-group">
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label > Year</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        {optionyear &&
                                                            <Select options={optionyear} placeholder='Year' name="year" value={year} onChange={this.handleChangesYear} />
                                                        }
                                                        <span className="text-danger">{erroryear}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Month</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        {DropdownMonth &&
                                                            <Select options={DropdownMonth} placeholder='Month' name="month" value={month} onChange={this.handleChangesMonth} />
                                                        }
                                                        <span className="text-danger">{errormonth}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Period</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        <input type="text" name="period" value={period} onChange={this.handleChange} className="form-control" placeholder="Period" disabled={true} />
                                                        <span className="text-danger">{errorperiod}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label > Inven Category</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        {optioninven_category &&
                                                            <Select options={optioninven_category} placeholder='Inventory Category' name="invencategory" value={invencategory} onChange={this.handleChangesInven_category} />
                                                        }
                                                        {/* <input type="text" name="invencategory" value={invencategory} onChange={this.handleChange} className="form-control" placeholder="Inventory Category" /> */}
                                                        <span className="text-danger">{errorinvencategory}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Stock No.</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        <input type="text" name="stockno" value={stockno} onChange={this.handleChange} className="form-control" placeholder="Stock No." />
                                                        <span className="text-danger">{errorstockno}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label">
                                                    </div>
                                                    <div className="col-md-7">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                </div>
                                                <div className="col-md-4">
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4">
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="btn-header transparent pull-right">
                                                            <button className="btn btn-primary btn-default">
                                                                <i className="fa  fa-search"></i> Search
                                                                </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {submitted && dataperiod &&
                                        <div className="widget-body no-padding">
                                            <hr />
                                            <DatatableUnitCost
                                                options={{
                                                    fixedHeader: true,
                                                    ajax: `${PathBackEnd}/api/unitcost/${dataperiod}/${datainvencategory}/${datastockno}`,
                                                    columns: [{ data: "STOCK_NUM" }, { data: "INV_ITEM" }, { data: "INV_ITEM_DESC" }, { data: "UOM" },

                                                    {
                                                        data: "UNIT_COST",
                                                        render: function (data, type, row) {
                                                            return `<input type="number"  name="txtfinname" class="form-control input-xs" disabled="disabled" value=${parseFloat(Math.round(data * 100) / 100).toFixed(2)} step='0.01'><label class="text-danger"></label>`;
                                                        }
                                                    },
                                                    {
                                                        data: "COUNT_PER_UNIT",
                                                        render: function (data, type, row) {
                                                            return `<input type="number"  name="txtfinname" class="form-control input-xs" disabled="disabled" value=${parseFloat(Math.round(data * 100) / 100).toFixed(2)} step='0.01'></div><label class="text-danger"></label>`;
                                                        }
                                                    }
                                                    ],
                                                    buttons: [
                                                        {
                                                            text: `<span ><i class="fa fa-edit" /><span class="hidden-mobile"> Edit</span></span>`,
                                                            className: `btn btn-primary btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                            action: function (e, dt, node, config) {
                                                                const table = $('#table').DataTable()
                                                                table.page.len(10000).draw();
                                                                table.buttons().disable();
                                                                table.rows().eq(0).each(function (index) {
                                                                    const row = table.row(index)
                                                                    const data = row.data()

                                                                    const inputCountCost = table.cell(index, 4).nodes().to$().find('input')
                                                                    inputCountCost.prop('disabled', false);

                                                                    const inputCountUnit = table.cell(index, 5).nodes().to$().find('input')
                                                                    inputCountUnit.prop('disabled', false);

                                                                })
                                                                self.setState({ edit: true })
                                                            }
                                                        },
                                                        {
                                                            extend: 'excel',
                                                            title: `UnitCost_Period${dataperiod}${(datainvencategory) ? `_InventoryCategory${datainvencategory}` : ''}${(datastockno) ? `_StockNo${datastockno}` : ''}`,
                                                            text: `<span ><i class="fa fa-mail-forward" /><span class="hidden-mobile"> Export</span></span>`,
                                                            className: `btn btn-default btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                            exportOptions: {
                                                                columns: [0, 1, 2, 3, 4, 5]
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
                                                            Stock No.
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            Inv Item
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            Description
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            UOM
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            Unit Cost
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            Count/Unit
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </DatatableUnitCost>
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
                                        </div>
                                    }
                                </div>
                                }
                            </JarvisWidget>
                        </article>
                    </div>
                    <div>
                        {/* Modal Upload */}
                        <div className="modal fade" id="myModalUpload" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="true">
                            <div className="modal-dialog ">
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
                                                    columns: [{ data: "Period" }, { data: "Stock No" }, { data: "Inv Item" }, { data: "Unit Cost" }, { data: "Unit" }, { data: "Status" }
                                                    ],
                                                }}
                                                paginationLength={true} className="table table-striped table-bordered table-hover"
                                                width="100%">
                                                <thead>
                                                    <tr>
                                                        <th data-hide="user"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Period
                                                    </th>
                                                        <th data-class="expand"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Stock No.
                                                    </th>
                                                        <th data-hide="user"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Inv Item
                                                    </th>
                                                        <th data-class="expand"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Unit Cost
                                                    </th>
                                                        <th data-class="expand"><i
                                                            className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                            Unit
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

                        {/* Modal Generate PH Inventory To E1 */}
                        <div className="modal fade"
                            id="myModalGenPHInventory" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                            aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                            &times;
                                            </button>
                                        <h4 className="modal-title" id="myModalLabel">Generate PH Inventory To E1</h4>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <div className="row form-group">
                                                <div className="col-md-12 form-group" >
                                                    <div className="col-md-3 control-label"><label > Year</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-5">
                                                        {optionyear &&
                                                            <Select options={optionyear} placeholder='Year' name="year" value={yeargeninven} onChange={this.handleChangesYearGenInven}/>
                                                        }
                                                        <span className="text-danger">{erroryeargeninven}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-md-12 form-group" >
                                                    <div className="col-md-3 control-label"><label > Period (End Date)</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-5">
                                                        {tempperiod &&
                                                            <Select options={optionperiod} placeholder='Period' name="periodgeninven" value={periodgeninven} onChange={this.handleChangesPeriodGenInven} disabled={!yeargeninven} />
                                                        }
                                                        <span className="text-danger">{errorperiodgeninven}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button id="btnGen" type="button" className="btn btn-primary" onClick={this.handleGenSubmit} data-loading-text="<i class='fa fa-spinner fa-spin '></i> Processing">
                                            Process
                                        </button>
                                        <button type="button" className="btn btn-default" data-dismiss="modal">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
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

const connectedEndingInventory = connect(mapStateToProps)(EndingInventory);
export default connectedEndingInventory