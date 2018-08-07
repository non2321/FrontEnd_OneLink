import React from 'react'
import { connect } from 'react-redux';
import Delay from 'react-delay'
import { Async } from 'react-select';
import 'react-select/dist/react-select.css';

import { smallBox, bigBox, SmartMessageBox } from '../../components/utils/actions/MessageActions'

import BootstrapValidator from '../../components/forms/validation/BootstrapValidator'

import { storeActions } from '../../actions/sdc'
import { PathBackEnd } from '../../../../settings'

import _ from 'lodash'

const validatorOptions = {
  excluded: [':disabled'],
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
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
    }
  }
};

const getOptions = () => {
  return fetch(`${PathBackEnd}/api/storeconfig/ddlbank`)
    .then((response) => {
      return response.json();
    }).then((json) => {
      return { options: json };
    });
}

class DatatableStore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromChild: '',
      store_id: '',
      store_name: '',
      bank_code: '',
      ddlBankCode: [],
      screen_id: this.props.screen_id
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleChanges = this.handleChanges.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)



    // this.setState({ store_id: '', store_name: '', bank_code: '' });
  }



  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleChanges = (bank_code) => {
    this.setState({ bank_code });
  }


  handleEditSubmit(e) {
    e.preventDefault()
    const { store_id, bank_code, screen_id } = this.state;
    const { dispatch } = this.props;
    this.setState({     
      errorbank_code: (bank_code) ? '' : 'The bank code is required'
    })
    if (store_id && bank_code.value) {
      this.setState({ submitted: true })
      const prm = {
        store_code: store_id.toString(),
        bank_code: bank_code.value.toString(),
        screen_id: screen_id,
      }
      dispatch(storeActions.editstore(prm));
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
      self.setState({
        store_id: data['STORE_CODE'],
        store_name: data['STORE'],
        bank_code: { value: data['BANK_CODE'], label: `${data['BANK_NAME']} - ${data['BANK_BRANCH']}` }
      })
    })

    element.on('click', 'tr #btnDelete', function () {
      let data = _dataTable.row($(this).parents('tr')).data()
      SmartMessageBox({
        title: `ลบข้อมูล ${data['STORE_CODE']} `,
        content: `คุณแน่ใจหรือไม่ว่าต้องการลบ  ${data['STORE']} `,
        buttons: '[No][Yes]'
      }, function (ButtonPressed) {
        if (ButtonPressed === "Yes") {
          const { screen_id } = self.state;
          const { dispatch } = self.props;

          if (data['STORE_CODE']) {
            const prm = {
              store_code: data['STORE_CODE'].toString(),
              screen_id: screen_id,
            }
            dispatch(storeActions.deletestore(prm));
          }
        }
        if (ButtonPressed === "No") {
        }
      });
    });


  }

  render() {
    let { children, options, detailsFormat, paginationLength, screen_name, ...props } = this.props;
    const { store_id, store_name, bank_code, errorbank_code } = this.state

    return (
      // <BootstrapValidator options={validatorOptions}>
      <div>
        <table id="table" {...props} ref="table">
          {children}
        </table>
        <div>
          {/* Modal Edit */}
          <div className="modal fade" id="myModalEdit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
            aria-hidden="true">
            <form id="add-form" onSubmit={this.handleEditSubmit}>
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
                        <div className="col-md-12">
                          <label htmlFor="store_name"> Store ID</label>
                          <input type="text" name="store_name" value={store_name} onChange={this.handleChange} className="form-control" id="txtStoreId" placeholder="Store ID" disabled={true} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="bank_code"> Bank Code</label>
                          <Delay wait={250} >
                            <Async
                              placeholder='Bank Code'
                              name="bank_code"
                              loadOptions={getOptions}
                              value={bank_code}
                              onChange={this.handleChanges}
                            />
                          </Delay>
                          <span className="text-danger">{errorbank_code}</span>
                          <div >
                          </div>
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
      // </BootstrapValidator>
    )
  }
}

const connectedDatatableStore = connect(null)(DatatableStore);
export default connectedDatatableStore