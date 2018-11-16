import React from 'react'
import { connect } from 'react-redux'

import { userAuth } from '../../../../actions/auth'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import { PathBackEnd, ScreenIDLogSDC } from '../../../../../../settings'
import { utils } from '../../../../services/utils'

import DatatableLogSDC from '../../../../components/tables/DatatableLogSDC'
import UiDatepicker from '../../../../components/forms/inputs/UiDatepicker'

class LogSDC extends React.Component {
    constructor(props) {
        super(props);

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDLogSDC,
            }
            this.props.dispatch(userAuth.loadpage(prm));
        }

        this.state = {
            submitted: false,
            screen_id: ScreenIDLogSDC
        }

        this.handleChange = this.handleChange.bind(this)

        this.handleDateFrom = this.handleDateFrom.bind(this)
        this.handleDateTo = this.handleDateTo.bind(this)

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
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

    async handleSearchSubmit(e) {
        e.preventDefault()
        const self = this

        const { datefrom, dateto } = this.state

        this.setState({
            errordatefrom: (datefrom) ? '' : 'The Financial Date From is required',
            errordateto: (dateto) ? '' : 'The Financial Date To is required',
            submitted: false
        })

        if (datefrom && dateto) {
            setTimeout(async () => {
                self.setState({
                    datadatefrom: utils.convertdateformatString(datefrom),
                    datadateto: utils.convertdateformatString(dateto),
                    submitted: true
                })
            }, 500)
        }
    }

    render() {
        const { datefrom, dateto } = this.state
        const { datadatefrom, datadateto, submitted } = this.state
        const { errordatefrom, errordateto } = this.state
        const { modify, screen_name } = this.props

        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                <header><h2>{screen_name}</h2></header>
                                {modify && <div>
                                    <div className="widget-body">
                                        <br />
                                        <div className="form-horizontal">
                                            <fieldset>
                                                <div className="form-group">
                                                    <div className="col-md-6 ">
                                                        <div className="col-md-4 control-label"><label >Date From</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <UiDatepicker type="text" name="startdate" id="startdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" datefrom="#startdate" dateto="#finishdate" onInputChange={this.handleDateFrom} value={datefrom}
                                                                placeholder="Start date" />
                                                            <span className="text-danger">{errordatefrom}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4 control-label"><label >Date To</label><span class="text-danger">*</span></div>
                                                        <div className="col-md-6">
                                                            <UiDatepicker type="text" name="finishdate" id="finishdate" changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="120" onInputChange={this.handleDateTo} value={dateto} disabled={!datefrom}
                                                                placeholder="Finish date" />
                                                            <span className="text-danger">{errordateto}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-6">
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-md-4"></div>
                                                        <div className="col-md-6">
                                                            <button onClick={this.handleSearchSubmit} className="btn btn-primary btn-default pull-right">
                                                                <i className="fa  fa-search"></i> Search
                                                                </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        {submitted && datadatefrom && datadateto &&
                                            <div className="widget-body no-padding">
                                                <hr />
                                                <DatatableLogSDC
                                                    options={{
                                                        order: [[0, 'desc']],
                                                        colReorder: true,
                                                        ajax: `${PathBackEnd}/api/logsdc/${datadatefrom}/${datadateto}`,
                                                        columns: [{ data: "Date Time", "width": "15%" }, { data: "User", "width": "20%" }, { data: "Menu", "width": "20%" }, { data: "Type", "width": "15%" }, { data: "New Data", "visible": false }, { data: "Old Data", "visible": false },
                                                        {
                                                            "mData": "New Data",
                                                            "mRender": function (data, type, full) {
                                                                const datasub = (data.length > 17) ? data.substr(0, 17) + '...' : data
                                                                return '<span data-toggle="tooltip" title="' + data + '" class="tooltiptext">' + datasub + '</span>';
                                                            }
                                                        },
                                                        {
                                                            "mData": "Old Data",
                                                            "mRender": function (data, type, full) {
                                                                const datasub = (data.length > 17) ? data.substr(0, 17) + '...' : data
                                                                return '<span data-toggle="tooltip" title="' + data + '" class="tooltiptext">' + datasub + '</span>';
                                                            }
                                                        }],
                                                        buttons: [
                                                            {
                                                                extend: 'excel',
                                                                title: `LogSDC_${datadatefrom}_${datadateto}`,
                                                                text: `<span ><i class="fa fa-mail-forward" /><span class="hidden-mobile"> Export</span></span>`,
                                                                className: `btn btn-default btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                                exportOptions: {
                                                                    columns: [0, 1, 2, 3, 4, 5]
                                                                }
                                                            }
                                                        ],
                                                    }}
                                                    paginationLength={true} className="table table-striped table-bordered table-hover"
                                                    width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th data-class="expand"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Date Time
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                User
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Menu
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Type
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                New Data
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Old Data
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                New Data
                                                            </th>
                                                            <th data-hide="user"><i
                                                                className="text-muted hidden-md hidden-sm hidden-xs" />
                                                                Old Data
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </DatatableLogSDC>
                                            </div>
                                        }
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

const connectedLogSDC = connect(mapStateToProps)(LogSDC);
export default connectedLogSDC