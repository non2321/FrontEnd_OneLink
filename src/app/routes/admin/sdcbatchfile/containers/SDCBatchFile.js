import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../actions/auth';
import { sdcbatchfileAction } from '../../../../actions/sdc';

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import DatatableSDCBatchFile from '../../../../components/tables/DatatableSDCBatchFile'


import { ScreenIDSDCBatchFile, PathBackEnd } from '../../../../../../settings'

import Select from 'react-select'
import 'react-select/dist/react-select.css';

class SDCBatchFile extends React.Component {
  constructor(props) {
    super(props)

    if (this.state === undefined) {
      const prm = {
        screen_id: ScreenIDSDCBatchFile,
      }
      this.props.dispatch(userAuth.loadpage(prm))
    }

    this.state = {
      submitted: false,
      screen_id: ScreenIDSDCBatchFile
    }

    this.handleProcessSubmit = this.handleProcessSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleChangesYear = (year) => {
    const { sdcinterfacefile } = this.state

    this.setState({
      year: (year == null) ? '' : year.value,
      month: '',
      day: '',
      store: ''
    })

    if (sdcinterfacefile && year) {
      const dataselect = sdcinterfacefile.filter((x) => {
        let resdate = new Date(x.value)
        return resdate.getFullYear() == year.value
      })
      let month = []
      for (let item of dataselect) {
        let resdate = new Date(item.value)
        month.push(resdate.getMonth() + 1)
      }
      const distinctmonth = [...new Set(month)].sort((a, b) => b - a)
      let optionmonth = []
      for (let item of distinctmonth) {
        optionmonth.push({ "value": item, "label": item })
      }
      this.setState({
        optionmonth: optionmonth
      })
    }
  }

  handleChangesMonth = (month) => {
    const { sdcinterfacefile } = this.state

    this.setState({
      month: (month == null) ? '' : month.value,
      day: '',
      store: ''
    })

    if (sdcinterfacefile && month) {
      const dataselect = sdcinterfacefile.filter((x) => {
        let resdate = new Date(x.value)
        return (resdate.getMonth() + 1) == month.value
      })
      let day = []
      for (let item of dataselect) {
        let resdate = new Date(item.value)
        day.push(resdate.getDate())
      }
      const distinctday = [...new Set(day)].sort((a, b) => b - a)
      let optionday = []
      for (let item of distinctday) {
        optionday.push({ "value": item, "label": item })
      }
      this.setState({
        optionday: optionday
      })
    }
  }

  handleChangesDay = async (day) => {
    const { year, month } = this.state
    this.setState({
      day: (day == null) ? '' : day.value,
      store: ''
    })

    if (year && month && day) {
      let response = await fetch(`${PathBackEnd}/api/sdcbatchfile/validationfile/${year}/${month}/${day.value}`)
      let json = await response.json()
      const keys = Object.keys(json)

      const table = $('#table').DataTable()

      await table.rows().eq(0).each(async function (index) {
        let row = table.row(index)
        let data = row.data()

        for (let item of keys) {
          if (data.file_type == item) {
            if (!json[item].data) {
              table.cell(index, 0).nodes().to$().find('input').prop("checked", false)
              table.cell(index, 0).nodes().to$().find('input').attr("disabled", true)
              table.cell(index, 5).nodes().to$().find('label').text(`${json[item].msg}`)
            } else {
              table.cell(index, 0).nodes().to$().find('input').removeAttr("disabled")
              table.cell(index, 5).nodes().to$().find('label').text('')
            }
            break
          }
        }
      })
    }

  }

  handleChangesStore = async (store) => {
    const { year, month, day } = this.state

    this.setState({
      store: (store == null) ? '' : store.value,
    })

    if (year && month && day && store) {
      let response = await fetch(`${PathBackEnd}/api/sdcbatchfile/validationfile/${year}/${month}/${day}/${store.value}`)
      let json = await response.json()
      const keys = Object.keys(json)

      const table = $('#table').DataTable()

      await table.rows().eq(0).each(async function (index) {
        let row = table.row(index)
        let data = row.data()

        for (let item of keys) {
          if (data.file_type == item) {
            if (!json[item].data) {
              table.cell(index, 0).nodes().to$().find('input').prop("checked", false)
              table.cell(index, 0).nodes().to$().find('input').attr("disabled", true)
              table.cell(index, 5).nodes().to$().find('label').text(`${json[item].msg}`)
            } else {
              table.cell(index, 0).nodes().to$().find('input').removeAttr("disabled")
              table.cell(index, 5).nodes().to$().find('label').text('')
            }
            break
          }
        }
      })
    } else if (year && month && day) {
      let response = await fetch(`${PathBackEnd}/api/sdcbatchfile/validationfile/${year}/${month}/${day}`)
      let json = await response.json()
      const keys = Object.keys(json)

      const table = $('#table').DataTable()

      await table.rows().eq(0).each(async function (index) {
        let row = table.row(index)
        let data = row.data()

        for (let item of keys) {
          if (data.file_type == item) {
            if (!json[item].data) {
              table.cell(index, 0).nodes().to$().find('input').prop("checked", false)
              table.cell(index, 0).nodes().to$().find('input').attr("disabled", true)
              table.cell(index, 5).nodes().to$().find('label').text(`${json[item].msg}`)
            } else {
              table.cell(index, 0).nodes().to$().find('input').removeAttr("disabled")
              table.cell(index, 5).nodes().to$().find('label').text('')
            }
            break
          }
        }
      })
    }
  }

  async handleProcessSubmit(e) {
    e.preventDefault()

    const { dispatch } = this.props
    const { year, month, day, store, screen_id } = this.state

    this.setState({
      erroryear: (year) ? '' : 'The Year is required',
      errormonth: (month) ? '' : 'The Month is required',
      errorday: (day) ? '' : 'The Day is required',
      submitted: false
    })

    const table = $('#table').DataTable()

    let objectitem = []
    await table.rows().eq(0).each(async function (index) {
      let row = table.row(index)
      let data = row.data()

      let inputchk = table.cell(index, 0).nodes().to$().find('input').prop('checked')
      if (inputchk) {
        const item = { file_type: data.file_type }
        objectitem.push(item)
      }
    })
    if (objectitem.length > 0 && year && month && day) {
      const prm = {
        file_type: objectitem,
        year: year,
        month: month,
        day: day,
        store: store,
        screen_id: screen_id
      }
      dispatch(await sdcbatchfileAction.rerunbatchsdcinterface(prm))

      this.setState({
        submitted: true
      })
    }
  }

  async componentDidMount() {
    try {

      setTimeout(async () => {
        let response = await fetch(`${PathBackEnd}/api/sdcbatchfile/dropdownfile`)
        let json = await response.json()
        let year = []
        for await (let item of json) {
          let resdate = new Date(item.value)
          year.push(resdate.getFullYear())
        }
        const distinctyear = [...new Set(year)].sort().reverse()
        let optionyear = []
        for await (let item of distinctyear) {
          optionyear.push({ "value": item, "label": item })
        }
        this.setState({
          sdcinterfacefile: json,
          optionyear: optionyear
        })
      }, 600)

      setTimeout(async () => {
        let response = await fetch(`${PathBackEnd}/api/report/storeall`)
        let json = await response.json()
        this.setState({
          optionstore: json
        })
      }, 600)


    }
    catch (err) {
      console.log(err);
    }
  }

  async componentDidUpdate() {
    const { alert } = this.props;

    if (alert.type == "alert-success") {
      $('#table').DataTable().ajax.reload();
      this.setState({ year: '', month: '', day: '', store: '' })
    }
  }



  render() {
    const { year, month, day, store } = this.state
    const { optionyear, errormonth, errorday } = this.state
    const { erroryear, optionmonth, optionday, optionstore } = this.state
    const { modify, screen_name } = this.props;
    const seft = this

    return (
      <div id="content">
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12">
              <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                <header><h2>{screen_name}</h2>
                </header>
                {modify && <div className="widget-body ">
                  <br />
                  <div className="form-horizontal">
                    <div className="form-group">
                      <div className="col-md-4">
                        <div className="col-md-4 control-label"><label > Year</label><span class="text-danger">*</span></div>
                        <div className="col-md-7">
                          <Select options={optionyear} placeholder='Year' name="year" value={year} onChange={this.handleChangesYear} />
                          <span className="text-danger">{erroryear}</span>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="col-md-4 control-label"><label >Month</label><span class="text-danger">*</span></div>
                        <div className="col-md-7">
                          <Select options={optionmonth} placeholder='Month' name="month" value={month} onChange={this.handleChangesMonth} disabled={!year} />
                          <span className="text-danger">{errormonth}</span>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="col-md-4 control-label"><label >Day</label><span class="text-danger">*</span></div>
                        <div className="col-md-7">
                          <Select options={optionday} placeholder='Day' name="month" value={day} onChange={this.handleChangesDay} disabled={!month} />
                          <span className="text-danger">{errorday}</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-4">
                        <div className="col-md-4 control-label"><label > Store</label></div>
                        <div className="col-md-7">
                          <Select options={optionstore} placeholder='All Store' name="store" value={store} onChange={this.handleChangesStore} disabled={!day} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="col-md-4 control-label"></div>
                        <div className="col-md-7">
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="col-md-4 control-label"></div>
                        <div className="col-md-7">
                        </div>
                      </div>
                    </div>

                    <div className="widget-body no-padding">
                      <hr />
                      {modify && <DatatableSDCBatchFile
                        options={{
                          fixedHeader: true,
                          ajax: `${PathBackEnd}/api/sdcbatchfile/tablefiletypeactive`,
                          columns: [
                            {
                              searchable: false,
                              data: null,
                              width: "25px",
                              render: function (data, type, row) {
                                return '<div class="smart-form checkbox "><label name="lblcheck"  class="checkbox"><input type="checkbox" name="checkbox"/><i name="chklist"/></label></div>'
                              }
                            },
                            { data: "file_type_id" }, { data: "file_type" }, { data: "file_type_desc" }, { data: "PROCESS_INTERVAL" },
                            {
                              data: "Status",
                              render: function (data, type, row) {
                                return `<label ></label>`;
                              }
                            }
                          ],
                          buttons: [
                          ],
                        }}
                        paginationLength={false} className="table table-striped table-bordered table-hover"
                        width="100%">
                        <thead>
                          <tr>
                            <th data-class="expand"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />

                            </th>
                            <th data-class="expand"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />
                              File Type ID
                                                        </th>
                            <th data-hide="user"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />
                              File Type
                                                        </th>
                            <th data-hide="user"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />
                              File Type Desc
                                                        </th>
                            <th data-hide="user"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />
                              Process Interval
                                                        </th>
                            <th data-hide="user"><i
                              className="text-muted hidden-md hidden-sm hidden-xs" />
                              Status
                                                        </th>
                          </tr>
                        </thead>
                      </DatatableSDCBatchFile>
                      }
                      <div className="smart-form">
                        <footer>
                          <button id="btnGengl" type="button" className="btn btn-primary btn-sm" onClick={this.handleProcessSubmit} data-loading-text="<i class='fa fa-spinner fa-spin '></i> Processing">
                            Process
                           </button>
                        </footer>
                      </div>
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
  const { alert } = state;
  const { loadpage } = state;
  const screen_name = loadpage.screen_name
  const modify = loadpage.modify
  return {
    modify,
    screen_name,
    alert
  };
}

const connectedSDCBatchFile = connect(mapStateToProps)(SDCBatchFile);
export default connectedSDCBatchFile