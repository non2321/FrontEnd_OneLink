import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';

import { userAuth } from '../../../../actions/auth';
import { inventoryActions } from '../../../../actions/sdc'
import { utils } from '../../../../services/utils'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'

import DatatableTermClosing from '../../../../components/tables/DatatableTermClosing'
import UiDatepicker from '../../../../components/forms/inputs/UiDatepicker'

import { ScreenIDTermClosing, PathBackEnd } from '../../../../../../settings'

import Select from 'react-select'
import 'react-select/dist/react-select.css'

import './TermClosing.css'


class TermClosing extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDTermClosing,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }

        const datenow = new Date()
        const yearnow = datenow.getFullYear()

        let optionyear = []
        const yearago = yearnow - 10
        const yearfuture = yearnow + 10
        for (let year = yearago; year <= yearfuture; year++) {
            const item = { "value": year, "label": year }
            optionyear.push(item)
        }

        this.state = {
            year: { value: yearnow, label: yearnow },
            edit: false,
            optionyear: optionyear.sort((a, b) => b.value - a.value),
            submitted: true,
            screen_id: ScreenIDTermClosing
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleAdd = this.handleAdd.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)

        this.handleAddSubmits = this.handleAddSubmits.bind(this)
    }

    handleAddSubmits(e) {
        e.preventDefault()
        const self = this
        const { dispatch } = this.props
        const { year, screen_id } = this.state

        this.setState({
            erroryear: (year) ? '' : 'The year is required',
            submitted: false
        })

        if (year) {
            const prm = {
                year: year.value,
                screen_id: screen_id,
            }
            dispatch(inventoryActions.addtermclosing(prm));

            setTimeout(function () {
                self.setState({ submitted: true });
            }, 200)
        }
    }

    handleAdd(e) {
        // e.preventDefault();
        const table = $('#table').DataTable()
        table.page.len(10000).draw();
        $('input[type="checkbox"]').prop('disabled', false);
        $('input[type="text"]').prop('disabled', false);
        $('label[name="lblcheck"]').removeClass("state-disabled");

        this.setState({ edit: true })
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        let self = this
        const { dispatch } = this.props
        const { screen_id } = this.state

        const table = $('#table').DataTable()

        table.page.len(10).draw();

        this.setState({
            edit: false,
            submitted: true
        })

        $('input[type="checkbox"]').prop('disabled', true);
        $('input[type="text"]').prop('disabled', true);
        $('input[name="checkbox]').prop("disabled", true);

        let objectitem = []
        table.rows().eq(0).each(function (index) {
            let row = table.row(index)
            let data = row.data()
            let inputBeginDate = table.cell(index, 4).nodes().to$().find('input').val()
            let inputEndDate = table.cell(index, 5).nodes().to$().find('input').val()
            if (inputBeginDate != data['PB_DATE_DESC'].toString() || inputEndDate != data['PE_DATE_DESC'].toString()) {
                if (data['TERM_ID'] && inputBeginDate && inputEndDate) {
                    const temp = {
                        term_id: data['TERM_ID'].toString(),
                        pb_date: utils.convertdateformatString(inputBeginDate),
                        pe_date: utils.convertdateformatString(inputEndDate),
                        screen_id: screen_id
                    }
                    objectitem.push(temp)
                }
            }
        })
        table.buttons().enable();      
        dispatch(inventoryActions.edittermclosing(objectitem));
    }


    handleCancel(e) {
        e.preventDefault();

        const table = $('#table').DataTable()
        table.page.len(10).draw();
        $('input[type="checkbox"]').prop('disabled', true);
        $('input[type="text"]').prop('disabled', true);
        this.setState({ edit: false })
        table.buttons().enable();
        $('#table').DataTable().ajax.reload();
    }

    handleChangesYear = (year) => {
        this.setState({
            year: (year == null) ? '' : year,
        })
    }

    render() {
        const { edit, year, optionyear, submitted, modifydata } = this.state
        const { erroryear } = this.state
        const { modify, screen_name } = this.props;
        const self = this
        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <form onSubmit={this.handleSubmit}>
                            <article className="col-sm-12">
                                <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                                    <header><h2>{screen_name}</h2></header>
                                    {modify && <div className="widget-body">
                                        <div className="widget-body no-padding">
                                            <DatatableTermClosing
                                                options={{
                                                    fixedHeader: true,
                                                    ajax: `${PathBackEnd}/api/termclosing`,
                                                    order: [[1, "desc"]],
                                                    columns: [{ data: "TERM_ID" }, { data: "PERIOD_ID" }, { data: "PB_DATE_DESC", "visible": false }, { data: "PE_DATE_DESC", "visible": false },
                                                    {
                                                        data: "PB_DATE_DESC", "width": "25%",
                                                        createdCell: (td, cellData, rowData, row, col) =>
                                                            ReactDOM.render(
                                                                <UiDatepicker type="text" name={`begindate${row}`} id={`begindate${row}`} datefrom={`#begindate${row}`} dateto={`#enddate${row}`} changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="90" value={cellData} disabled
                                                                    placeholder="Begin date" />, td)
                                                    },
                                                    {
                                                        data: "PE_DATE_DESC", "width": "25%",
                                                        createdCell: (td, cellData, rowData, row, col) =>
                                                            ReactDOM.render(
                                                                <UiDatepicker type="text" name={`enddate${row}`} id={`enddate${row}`} changeMonth="true" changeYear="true" dateFormat="dd/mm/yy" addday="90" value={cellData} disabled
                                                                    placeholder="End date" />, td)
                                                    }
                                                    ],
                                                    buttons: [
                                                        {
                                                            text: `<span ><i class="fa fa-plus" /><span class="hidden-mobile"> Add</span></span>`,
                                                            className: `btn btn-primary btn-sm ${(modify.can_add == "Y") ? '' : 'hidden'}`,
                                                            action: function (e, dt, node, config) {
                                                                $("#myModalAdd").modal()
                                                                const datenow = new Date()
                                                                const yearnow = datenow.getFullYear()
                                                                seft.setState({ year: { value: yearnow, label: yearnow } });
                                                            }
                                                        },
                                                        {
                                                            text: `<span ><i class="fa fa-edit" /><span class="hidden-mobile"> Edit</span></span>`,
                                                            className: `btn btn-primary btn-sm ${(modify.can_edit == "Y") ? '' : 'hidden'}`,
                                                            action: function (e, dt, node, config) {
                                                                const table = $('#table').DataTable()
                                                                table.page.len(10000).draw();
                                                                $('input[type="checkbox"]').prop('disabled', false);
                                                                $('input[type="text"]').prop('disabled', false);
                                                                $('label[name="lblcheck"]').removeClass("state-disabled");
                                                                table.buttons().disable();
                                                                self.setState({ edit: true })
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
                                                            Term ID
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            Period ID
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            Begin Date
                                                        </th>
                                                        <th data-hide="user">
                                                            End Date
                                                        </th>
                                                        <th data-hide="user"><i
                                                            className="text-muted hidden-md hidden-sm hidden-xs" />
                                                            Begin Date
                                                        </th>
                                                        <th data-hide="user">
                                                            End Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </DatatableTermClosing>
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
                                    </div>
                                    }
                                </JarvisWidget>
                            </article>
                        </form>
                    </div>
                </WidgetGrid>

                {/* Modal Add */}
                {modify &&
                    <div className="modal fade" id="myModalAdd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                        aria-hidden="true">
                        <form id="add-form" onSubmit={this.handleAddSubmits}>
                            <div className="modal-dialog modal-sm">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                            &times;
                                        </button>
                                        <h4 className="modal-title" id="myModalLabel">Add {screen_name}</h4>
                                    </div>
                                    <div className="modal-body">
                                        <div class="form-group">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label htmlFor="bank_code"> Year</label><span class="text-danger">*</span>
                                                    {optionyear &&
                                                        <Select options={optionyear} placeholder='Year' name="year" value={year} onChange={this.handleChangesYear} />
                                                    }
                                                    <span className="text-danger">{erroryear}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button id="btnsubmit" type="button" type="submit" className="btn btn-primary" data-loading-text="<i class='fa fa-spinner fa-spin '></i> Processing">
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
                }
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

const connectedTermClosing = connect(mapStateToProps)(TermClosing);
export default connectedTermClosing