import React from 'react'
import { connect } from 'react-redux'

import { userAuth } from '../../../../actions/auth'
import { financialActions } from '../../../../actions/sdc'
import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'

import { ScreenIDGenDataFilePL, PathBackEnd, DropdownMonth } from '../../../../../../settings'
import DatatableGenDataPLUpload from '../../../../components/tables/DatatableGenDataPLUpload'
import { alertActions } from '../../../../actions/alert/alert.actions'

import delay from 'delay'

import Select from 'react-select'
import 'react-select/dist/react-select.css'

class GenDataFilePL extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDGenDataFilePL,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        const datenow = new Date()
        const monthnow = datenow.getMonth() + 1
        const yearnow = datenow.getFullYear()
        let optionyear = []
        const yearago = yearnow - 2
        for (let year = yearago; year <= yearnow; year++) {
            const item = { "value": year, "label": year }
            optionyear.push(item)
        }


        this.state = {
            month: monthnow,
            year: yearnow,
            optionmonth: DropdownMonth.filter((x) => x.value <= monthnow),
            optionyear: optionyear.sort((a, b) => b.value - a.value),
            upload: null,
            submitted: false,
            screen_id: ScreenIDGenDataFilePL
        }

        this.onChangeFile = this.onChangeFile.bind(this)
        this.handleProcessSubmit = this.handleProcessSubmit.bind(this)
    }

    async onChangeFile(e) {
        e.preventDefault()

        $('#btnfile').button('loading')
        const self = this
        this.setState({ uploading: true })
        if (e.target.files.length > 0) {
            this.setState({ file: e.target.files[0], filename: e.target.files[0].name })

            let files = e.target.files, file;
            if (!files || files.length == 0) return;
            file = files[0];

            //Type Text file
            if (file.type == 'text/plain') {
                let fileReader = new FileReader()
                fileReader.readAsText(file)
                fileReader.onload = async () => {
                    const tempfiletostring = fileReader.result.toString('utf8').trim()
                    const tempfilebyline = tempfiletostring.match(/[^\r\n]+/g)

                    if (tempfilebyline) {
                        let objectitem = []
                        let status = true
                        for await (let temp of tempfilebyline) {
                            let tempdata = temp.trim().split(',')
                            // console.log(tempdata)
                            if (tempdata.length != 5) {
                                status = false
                                break
                            }
                            let prmData = {}
                            let colume = 1
                            for (let item of tempdata) {
                                prmData[`C${colume}`] = item
                                colume++
                            }
                            prmData['Status'] = ''
                            objectitem.push(prmData)
                        }
                        if (status) {
                            let data = {
                                "aaData": objectitem
                            }
                            self.setState({ uploading: false, upload: data, obj: objectitem })
                        } else {
                            self.setState({ uploading: false, file: null, filename: 'Choose a file...', upload: null, obj: null })
                            self.props.dispatch(alertActions.error("File incorrect."))
                        }
                    } else {
                        self.setState({ uploading: false, file: null, filename: 'Choose a file...', upload: null, obj: null })
                        self.props.dispatch(alertActions.warning("Data not found."))
                    }
                }
            } else {
                self.setState({ uploading: false, file: null, filename: 'Choose a file...', upload: null, obj: null })
                self.props.dispatch(alertActions.error("File incorrect."))
            }
            e.target.value = '';
        }

        await delay(3000)
        $('#btnfile').button('reset')
    }

    async handleProcessSubmit(e) {
        e.preventDefault()    
            
        const { dispatch } = this.props
        const { screen_id, obj, year, month } = this.state
        this.setState({ uploading: true })
        const self = this
        await setTimeout(async () => {
            if (obj && screen_id) {

                let statusall = true
                let objectitem = []
                let period = ''
                for await (let item of obj) {
                    item['Status'] = 'Success'
                    let status = true

                    if (item['C1'].trim() == '') status = false
                    if (item['C2'].trim() == '') status = false
                    if (item['C3'].trim() == '') status = false
                    if (item['C4'].trim() == '') status = false
                    if (item['C5'].trim() == '') status = false

                    if (Number.isNaN(parseFloat(item['C2']))) status = false
                    if (Number.isNaN(parseFloat(item['C3']))) status = false
                    if (Number.isNaN(parseFloat(item['C4']))) status = false
                    if (Number.isNaN(parseFloat(item['C5']))) status = false

                    objectitem.push(item)

                    if (status == false) {
                        item['Status'] = 'Fail'
                        statusall = false
                    }
                }

                let data = {
                    "aaData": objectitem
                }
                if (statusall == true) {
                    dispatch(await financialActions.gendatafilePL(year, month, objectitem, screen_id));
                    self.setState({ uploading: false, upload: data, obj: null })
                    
                } else {
                    self.setState({ uploading: false, upload: data, obj: null })
                }
            }
        }, 100)
    }

    handleChangesMonth = (month) => {
        this.setState({
            month: (month == null) ? '' : month.value,
        })
    }

    handleChangesYear = (year) => {
        this.setState({
            year: (year == null) ? '' : year.value,
        })

        if (year) {
            const datenow = new Date()
            const monthnow = datenow.getMonth() + 1
            const yearnow = datenow.getFullYear()
            if (year.value == yearnow) {
                this.setState({
                    optionmonth: DropdownMonth.filter((x) => x.value <= monthnow),
                })
            } else {
                this.setState({
                    optionmonth: DropdownMonth,
                })
            }
        }
    }

    render() {
        const { year, month } = this.state
        const { optionyear, optionmonth } = this.state
        const { errormonth, erroryear } = this.state
        const { filename, upload, uploading, obj } = this.state
        const { modify, screen_name } = this.props;


        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2></header>
                                {modify &&
                                    <div className="widget-body">
                                        <div className="form-horizontal">
                                            <br />
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
                                                        {optionmonth &&
                                                            <Select options={optionmonth} placeholder='Month' name="month" value={month} onChange={this.handleChangesMonth} />
                                                        }
                                                        <span className="text-danger">{errormonth}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="col-md-4 control-label"><label >Import File</label><span class="text-danger">*</span></div>
                                                    <div className="col-md-7">
                                                        <input id="fileInput" type="file" name="file-1" id="file-1" class="inputfile inputfile-1" onChange={this.onChangeFile} accept="text/plain" />
                                                        <label id="btnfile" for="file-1" className="btn btn-primary btn-sm " data-loading-text="<i class='fa fa-spinner fa-spin '></i> Processing">
                                                            &nbsp;Browse&nbsp;&nbsp;
                                                            </label>
                                                        <label >&nbsp;&nbsp;{filename}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="no-padding">
                                                {upload && uploading == false &&
                                                    <DatatableGenDataPLUpload
                                                        options={{
                                                            order: [[5, 'asc']],
                                                            colReorder: true,
                                                            ajax: function (data, callback, settings) {
                                                                callback(
                                                                    upload
                                                                )
                                                            },
                                                            columns: [{ data: "C1" }, { data: "C2" }, { data: "C3" }, { data: "C4" }, { data: "C5" }, { data: "Status" }
                                                            ],
                                                            buttons: [
                                                            ],
                                                        }}

                                                        paginationLength={true} className="table table-striped table-bordered table-hover"
                                                        width="100%">
                                                        <thead>
                                                            <tr>
                                                                <th data-hide="user"><i
                                                                    className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                    Description
                                                                </th>
                                                                <th data-class="expand"><i
                                                                    className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                    E1AccCode
                                                                </th>
                                                                <th data-hide="user"><i
                                                                    className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                    Amount
                                                                </th>
                                                                <th data-class="expand"><i
                                                                    className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                    Percent
                                                                </th>
                                                                <th data-class="expand"><i
                                                                    className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                    CostCenter
                                                                </th>
                                                                <th data-class="expand"><i
                                                                    className=" text-muted hidden-md hidden-sm hidden-xs" />
                                                                    Status
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                    </DatatableGenDataPLUpload>
                                                }
                                                {upload && uploading == false &&
                                                    <div className="modal-footer">
                                                        <button id="btnProcess" type="button" className="btn btn-primary" disabled={!year || !month || !obj || uploading} onClick={this.handleProcessSubmit} data-loading-text="<i class='fa fa-spinner fa-spin '></i> Processing">
                                                            Upload
                                                        </button>
                                                    </div>
                                                }
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

const connectedGenDataFilePL = connect(mapStateToProps)(GenDataFilePL);
export default connectedGenDataFilePL