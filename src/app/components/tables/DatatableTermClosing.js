import React from 'react'
import { connect } from 'react-redux';
import { smallBox, bigBox, SmartMessageBox } from '../../components/utils/actions/MessageActions'

import BootstrapValidator from '../../components/forms/validation/BootstrapValidator'

import { companyActions } from '../../actions/sdc'
import { ScreenIDSetupCompanyAccount } from '../../../../settings'

import _ from 'lodash'
import $ from 'jquery';

const validatorOptions = {
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        company_code: {
            // The group will be set as default (.form-group)
            validators: {
                notEmpty: {
                    message: 'The company code is required'
                }
            }
        },
        company_name: {
            // The group will be set as default (.form-group)
            validators: {
                notEmpty: {
                    message: 'The company name is required'
                }
            }
        },
        report_name: {
            // The group will be set as default (.form-group)
            validators: {
                notEmpty: {
                    message: 'The report name is required'
                }
            }
        }
    }
};

class DatatableTermClosing extends React.Component {
    componentDidMount() {
        System.import('script-loader!smartadmin-plugins/datatables-bundle/datatables.min.js').then(() => {
            this.datatable(this.props.data)
        })
    }

    datatable() {
        const self = this;
        const element = $(this.refs.table);
        let { options } = { ...this.props } || {}

        let toolbar = '';
        if (options.buttons)
            toolbar += 'B';
        if (this.props.paginationLength)
            toolbar += 'l';
        if (this.props.columnsHide)
            toolbar += 'C';

        if (typeof options.ajax === 'string') {
            let url = options.ajax;
            options.ajax = {
                url: url,
                complete: function (xhr) {
                    // AjaxActions.contentLoaded(xhr)
                }
            }
        }

        options = _.extend(options, {

            "dom": "<'dt-toolbar'<'col-xs-12 col-sm-8' B><'pull-right hidden-xs' l><'pull-right' f>r >" +
                "t" +
                "<'dt-toolbar-footer' <'col-sm-6 col-xs-12 hidden-xs'i>p<'col-xs-12 col-sm-6'>>",
            oLanguage: {
                "sSearch": "<span class='input-group-addon input-sm'><i class='glyphicon glyphicon-search'></i></span> ",
                "sLengthMenu": "_MENU_"
            },
            "autoWidth": false,
            retrieve: true,
            responsive: true
        });

        const _dataTable = element.DataTable(options);
        this.setState({ myTable: _dataTable });

        if (this.props.filter) {
            // Apply the filter
            element.on('keyup change', 'thead th input[type=text]', function () {
                _dataTable
                    .column($(this).parent().index() + ':visible')
                    .search(this.value)
                    .draw();
            });
        }

        if (!toolbar) {
            element.parent().find(".dt-toolbar").append('<div class="text-right"><img src="assets/img/logo.png" alt="SmartAdmin" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>');
        }

        if (this.props.detailsFormat) {
            const format = this.props.detailsFormat;
            element.on('click', 'td.details-control', function () {
                const tr = $(this).closest('tr');
                const row = _dataTable.row(tr);
                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            })
        }
    }

    render() {
        let { children, options, detailsFormat, paginationLength, ...props } = this.props;
        return (
            <div>
                <table id="table" {...props} ref="table">
                    {children}
                </table>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedDatatableTermClosing = connect(mapStateToProps)(DatatableTermClosing);
export default connectedDatatableTermClosing