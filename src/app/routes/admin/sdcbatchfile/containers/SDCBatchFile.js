import React from 'react'
import { connect } from 'react-redux';

import { userAuth } from '../../../../actions/auth';

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
      day: ''
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
      day: ''
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

  handleChangesDay = (day) => {
    this.setState({
      day: (day == null) ? '' : day.value,
    })
  }

  async componentDidMount() {
    try {
      // setTimeout(async () => {
      //   let response = await fetch(`${PathBackEnd}/api/sdcbatchfile/filetypeactive`)
      //   let json = await response.json()
      //   this.setState({
      //     typefile: json
      //   })
      // }, 300)

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
    }
    catch (err) {
      console.log(err);
    }
  }



  render() {
    const { year, month, day, stamp, typefile } = this.state
    const { optionyear, errormonth, errorday } = this.state
    const { erroryear, optionmonth, optionday } = this.state
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
                    {/* <div className="form-group">
                      <div className="col-md-2">
                        <div className="col-md-9 control-label"><label >File Type</label><span class="text-danger">*</span></div>
                      </div>
                      <div className="col-md-8">
                        {typefile.map(function (item, index) {
                          return <div className="col-md-3 smart-form">
                            <label className="radio align-top">
                              <input type="radio" name="radio-inline" value={item.value} checked={stamp === item.value} />
                              <i />{item.label}</label>
                          </div>
                        })}
                      </div>
                    </div> */}
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
                            { data: "file_type_id" }, { data: "file_type" }, { data: "file_type_desc" }, { data: "PROCESS_INTERVAL" }
                          ],
                          buttons: [
                          ],
                        }}
                        paginationLength={true} className="table table-striped table-bordered table-hover"
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
                          </tr>
                        </thead>
                      </DatatableSDCBatchFile>
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

const connectedSDCBatchFile = connect(mapStateToProps)(SDCBatchFile);
export default connectedSDCBatchFile