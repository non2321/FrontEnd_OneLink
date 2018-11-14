import React from 'react'
import { connect } from 'react-redux';
import { smallBox, bigBox, SmartMessageBox } from '../../components/utils/actions/MessageActions'

import BootstrapValidator from '../../components/forms/validation/BootstrapValidator'

import { financialActions } from '../../actions/sdc'

import _ from 'lodash'

const validatorOptions = {
  feedbackIcons: {
    // valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    bank_code: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The bank code is required'
        }
      }
    },
    bank_name: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The bank name is required'
        }
      }
    },
    bank_branch: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The bank branch is required'
        }
      }
    },
    account_code: {
      // The group will be set as default (.form-group)
      group: '.col-md-6',
      validators: {
        notEmpty: {
          message: 'The account code is required'
        },
        stringLength: {
          max: 30,
          message: 'The account code be less than 30 characters long'
        }
      }
    }
  }
};

class DatatableBankAccount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bank_code: '',
      bank_name: '',
      bank_branch: '',
      account_code: '',
      screen_id: this.props.screen_id
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleEditSubmit(e) {
    e.preventDefault()
    const { bank_code, bank_name, bank_branch, account_code, screen_id } = this.state;
    const { dispatch } = this.props;

    if (bank_code && bank_name && bank_branch) {
      this.setState({ submitted: true });
      const prm = {
        bank_code: bank_code,
        bank_name: bank_name,
        bank_branch: bank_branch,
        account_code: account_code,
        screen_id: screen_id,
      }
      dispatch(financialActions.editbankaccount(prm));
    }
  }

  componentDidMount() {
    System.import('script-loader!smartadmin-plugins/datatables-bundle/datatables.min.js').then(() => {
      this.datatable(this.props.data)
    })
    // setTimeout(function () { //Start the timer
    //   $('#table').DataTable().ajax.reload();
    // }.bind(this), 1000)
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

    element.on('click', 'th', function () {
      $('#table').DataTable().ajax.reload();
    })


    element.on('click', 'tr #btnEdit', function () {
      let data = _dataTable.row($(this).parents('tr')).data()

      $('#edit-form').bootstrapValidator("resetForm", true);  

      self.setState({
        bank_code: data['BANK_CODE'],
        bank_name: data['BANK_NAME'],
        bank_branch: data['BANK_BRANCH'],
        account_code: data['ACCOUNT_CODE']
      })
    })

    element.on('click', 'tr #btnDelete', function () {
      let data = _dataTable.row($(this).parents('tr')).data()
      SmartMessageBox({
        title: `ลบข้อมูล ${data['BANK_CODE']} `,
        content: `คุณแน่ใจหรือไม่ว่าต้องการลบ  ${data['BANK_NAME']} `,
        buttons: '[No][Yes]'
      }, function (ButtonPressed) {
        if (ButtonPressed === "Yes") {
          const { screen_id } = self.state;
          const { dispatch } = self.props;

          if (data['BANK_CODE']) {
            const prm = {
              bank_code: data['BANK_CODE'],
              screen_id: screen_id,
            }
            dispatch(financialActions.deletebankaccount(prm));
          }
        }
        if (ButtonPressed === "No") {
        }
      });
    });
  }

  render() {
    let { children, options, detailsFormat, paginationLength, screen_id, screen_name, dispatch, ...props } = this.props;
    const { bank_code, bank_name, bank_branch, account_code } = this.state;
    return (
      <BootstrapValidator options={validatorOptions}>
        <div>
          <table id="table" {...props} ref="table">
            {children}
          </table>
          <div>
            {/* Modal Edit */}
            <div className="modal fade" id="myModalEdit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
              aria-hidden="true">
              <form id="edit-form" onSubmit={this.handleEditSubmit}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                      </button>
                      <h4 className="modal-title" id="myModalLabel">Edit {this.props.screen_name}</h4>
                    </div>
                    <div className="modal-body">
                      <div class="form-group">
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label htmlFor="bank_code"> Bank Code</label><span class="text-danger">*</span>
                            <input type="text" name="bank_code" disabled="disabled" value={bank_code} onChange={this.handleChange} className="form-control" id="txtBankCode" placeholder="Bank Code" />
                          </div>
                          <div className="col-md-6 form-group">
                            <label htmlFor="bank_name"> Bank Name</label><span class="text-danger">*</span>
                            <input type="text" name="bank_name" value={bank_name} onChange={this.handleChange} className="form-control" id="txtBankName" placeholder="Bank Name" />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label htmlFor="bank_branch"> Bank Branch</label><span class="text-danger">*</span>
                            <input type="text" name="bank_branch" value={bank_branch} onChange={this.handleChange} className="form-control" id="txtBankBranch" placeholder="Bank Branch" />
                          </div>
                          <div className="col-md-6 form-group">
                            <label htmlFor="account_code"> Account Code</label><span class="text-danger">*</span>
                            <input type="text" name="account_code" value={account_code} onChange={this.handleChange} className="form-control" id="txtAccountCode" placeholder="Account Code" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" type="submit" className="btn btn-primary">
                        Save
                      </button>
                      {/* <button type="button" onClick={this._smartModEg1} className="btn btn-default" data-dismiss="modal"> */}
                      <button type="button" className="btn btn-default" data-dismiss="modal">
                        Cancel
                      </button>
                    </div>
                  </div>
                  {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
              </form>
            </div>
            {/* /.modal */}
          </div>
        </div>
      </BootstrapValidator>
    )
  }
}

const connectedDatatableBankAccount = connect(null)(DatatableBankAccount);
export default connectedDatatableBankAccount