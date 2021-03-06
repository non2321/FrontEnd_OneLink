import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../actions/auth';
import { financialActions } from '../../../../actions/sdc'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'

import DatatableFinancialCode from '../../../../components/tables/DatatableFinancialCode'

import { ScreenIDSetupFinancialCode, PathBackEnd, DropdownActive } from '../../../../../../settings'
import Select from 'react-select'
import 'react-select/dist/react-select.css'


class SetupCompanyAccount extends React.Component {
  constructor(props) {
    super(props)

    if (this.state === undefined) {
      const prm = {
        screen_id: ScreenIDSetupFinancialCode,
      }
      this.props.dispatch(userAuth.loadpage(prm))
    }

    this.state = {
      account_code: '',
      edit: false,
      submitted: true,
      screen_id: ScreenIDSetupFinancialCode
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)

    this.handleAddSubmits = this.handleAddSubmits.bind(this)
  }

  handleAddSubmits(e) {
    e.preventDefault()
    const { financialcode, financialname, active, show, screen_id } = this.state
    const { dispatch } = this.props
    const self = this

    this.setState({
      errorfinancialcode: (financialcode) ? '' : 'The Financial Code is required',
      errorfinancialname: (financialname) ? '' : 'The Financial Name is required',
      erroractive: (active) ? '' : 'The Active is required',
      errorshow: (show)? '': 'The Show is required',
      submitted: false
    })

    if (financialcode && financialname && active && show) {
      const prm = {
        fin_code: financialcode,
        fin_name: financialname,
        active: active.value,
        show: show.value,
        screen_id: screen_id,
      }
      dispatch(financialActions.addfinancialcode(prm))

      setTimeout(function () {
        self.setState({ submitted: true })
      }, 500)
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

  handleChangesActive = (active) => {
    this.setState({
      active: (active == null) ? { value: "1", label: "Active" } : active
    })
  }

  handleChangesShow = (show) => {
    this.setState({
      show: (show == null) ? { value: "1", label: "Active" } : show
    })
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


    //check required
    let check_required = true
    table.rows().eq(0).each(function (index) {
      let inputtxt = table.cell(index, 2).nodes().to$().find('input').val()
      if (inputtxt.toString().trim() == '') {
        table.cell(index, 2).nodes().to$().find('label').text('required')
        check_required = false
      } else {
        table.cell(index, 2).nodes().to$().find('label').text('')
      }
    })

    if (check_required == true) {
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

        let inputtxt = table.cell(index, 2).nodes().to$().find('input').val()
        let inputchkFlag = table.cell(index, 3).nodes().to$().find('input').prop('checked')
        let inputchkShow = table.cell(index, 4).nodes().to$().find('input').prop('checked')
        let Flag = (inputchkFlag == true) ? '1' : '0'
        let Show = (inputchkShow == true) ? '1' : '0'
        if (inputtxt != data['FINANCIAL_DESC'].toString() || Flag != data['FIXFLAG'].toString() || Show != data['S_DAILY_FINS_FLAG'].toString()) {
          if (data['FINANCIAL_CODE'] && Flag) {
            const temp = { fin_code: data['FINANCIAL_CODE'].toString(), fin_desc: inputtxt, fin_flag: Flag, fin_show: Show, screen_id: screen_id }
            objectitem.push(temp)
          }
        }
      })
      table.buttons().enable();
      dispatch(financialActions.editfinancialcode(objectitem));
    }
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


  render() {
    const { edit, submitted, modifydata } = this.state;
    const { financialcode, financialname, active, show } = this.state
    const { errorfinancialcode, errorfinancialname, erroractive, errorshow } = this.state
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
                      <DatatableFinancialCode actions={edit}
                        options={{
                          fixedHeader: true,
                          ajax: `${PathBackEnd}/api/financialcodeconfig`,
                          columns: [{ data: "FINANCIAL_CODE" }, { data: "FINANCIAL_DESC", "visible": false },
                          {
                            data: "FINANCIAL_DESC",
                            render: function (data, type, row) {                              
                              return `<input type="text"  name="txtfinname" class="form-control input-xs" disabled="disabled" value='${data}'></div><label class="text-danger"></label>`;
                            }
                          },
                          {
                            searchable: false,
                            data: null,
                            width: "20%",
                            render: function (data, type, row) {
                              if (row.FIXFLAG == "1") {
                                return '<div class="smart-form checkbox "><label name="lblcheck"  class="checkbox state-disabled"><input type="checkbox" name="checkbox" disabled="disabled" checked/><i name="chklist"/></label></div>'
                              } else {
                                return '<div class="smart-form checkbox "><label name="lblcheck"  class="checkbox state-disabled"><input type="checkbox" name="checkbox" disabled="disabled"/><i name="chklist"/></label></div>'
                              }
                              return data;
                            }
                          },
                          {
                            searchable: false,
                            data: null,
                            width: "20%",
                            render: function (data, type, row) {
                              if (row.S_DAILY_FINS_FLAG == "1") {
                                return '<div class="smart-form checkbox "><label name="lblcheck"  class="checkbox state-disabled"><input type="checkbox" name="checkbox" disabled="disabled" checked/><i name="chklist"/></label></div>'
                              } else {
                                return '<div class="smart-form checkbox "><label name="lblcheck"  class="checkbox state-disabled"><input type="checkbox" name="checkbox" disabled="disabled"/><i name="chklist"/></label></div>'
                              }
                              return data;
                            }
                          }
                          ],
                          buttons: [
                            {
                              text: `<span ><i class="fa fa-plus" /><span class="hidden-mobile"> Add</span></span>`,
                              className: `btn btn-primary btn-sm ${(modify.can_add == "Y") ? '' : 'hidden'}`,
                              action: function (e, dt, node, config) {
                                $("#myModalAdd").modal()
                                self.setState({ financialcode: '', financialname: '', active: { value: "1", label: "Active" }, show: { value: "1", label: "Active" }, submitted: false });
                                $('#financialcode').prop('disabled', false)
                                $('#financialname').prop('disabled', false);
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
                                // (self.state.edit)? 'disabled': ''
                                // $('button[name="text"]').prop('disabled', false);
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
                              Financial Code
                              </th>
                            <th data-hide="user"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />
                              Financial Name
                              </th>
                            <th data-hide="user"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />
                              Financial Name
                              </th>
                            <th data-hide="user">
                              Edit Account Daily Fins
                              </th>
                            <th data-hide="user">
                            Show Bank-In Adjustment
                              </th>
                          </tr>
                        </thead>
                      </DatatableFinancialCode>
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
        <div className="modal fade" id="myModalAdd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <form id="add-form" >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                    &times;
                      </button>
                  <h4 className="modal-title" id="myModalLabel">Add {screen_name}</h4>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <label htmlFor="financialcode"> Financial Code</label>
                        <input type="text" name="financialcode" id="financialcode" value={financialcode} onChange={this.handleChange} className="form-control" placeholder="Finnancial Code" />
                        <span className="text-danger">{errorfinancialcode}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <label htmlFor="financialname"> Financial Name</label>
                        <input type="text" name="financialname" id="financialname" value={financialname} onChange={this.handleChange} className="form-control" placeholder="Finnancial Name" />
                        <span className="text-danger">{errorfinancialname}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <label htmlFor="active"> Edit Account Daily Fins</label>
                        {DropdownActive && active &&
                          <Select options={DropdownActive} placeholder='Active' name="active" value={active} onChange={this.handleChangesActive} />
                        }
                        <span className="text-danger">{erroractive}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <label htmlFor="active"> Show Bank-In Adjustment</label>
                        {DropdownActive && active &&
                          <Select options={DropdownActive} placeholder='Active' name="active" value={show} onChange={this.handleChangesShow} />
                        }
                        <span className="text-danger">{errorshow}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={this.handleAddSubmits} className="btn btn-primary">
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

const connectedSetupCompanyAccount = connect(mapStateToProps)(SetupCompanyAccount);
export default connectedSetupCompanyAccount