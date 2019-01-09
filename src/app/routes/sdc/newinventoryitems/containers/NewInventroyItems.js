import React from 'react'
import { connect } from 'react-redux'
import { userAuth } from '../../../../actions/auth'
import { inventoryActions } from '../../../../actions/sdc'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../components'
import Datatable from '../../../../components/tables/Datatable'
import PopupVendorForNewInventoryItems from '../../../../components/tables-popup/PopupVendorForNewInventoryItems'

import { ScreenIDNewInventoryItems, PathBackEnd } from '../../../../../../settings'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


class NewInventroyItems extends React.Component {
  constructor(props) {
    super(props)

    if (this.state === undefined) {
      const prm = {
        screen_id: ScreenIDNewInventoryItems,
      }
      this.props.dispatch(userAuth.loadpage(prm))
    }

    this.state = {
      tabIndex: 0,
      submitted: false,
      screen_id: ScreenIDNewInventoryItems
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleDataVendor = this.handleDataVendor.bind(this)
    this.handlePopSubmit = this.handlePopSubmit.bind(this)
    this.handleAddSubmit = this.handleAddSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target

    if (name == 'postinginterval') {
      let status = false
      if (/^[a-zA-Z]+$/.test(value)) {
        status = true
      }
      if (value == '') {
        status = true
      }
      if (status) {
        this.setState({ [name]: (value.length > 1) ? value.substring(0, 1).toUpperCase() : value.toUpperCase() })
      }      
    } else {
      this.setState({ [name]: value })
    }
    if (name == 'costperinvoice') {
      const scal2 = this.state.scalm2
      const scal3 = this.state.scalm3
      const scal4 = this.state.scalm4
      if (scal2) {
        const data = value / scal2
        const dataround = (data == 'Infinity' || data == 'NaN') ? '' : parseFloat(Math.round(data * 100) / 100).toFixed(2)
        this.setState({ costm2: dataround })
      }
      if (scal3) {
        const data = value / scal3
        const dataround = (data == 'Infinity' || data == 'NaN') ? '' : parseFloat(Math.round(data * 100) / 100).toFixed(2)
        this.setState({ costm3: dataround })
      }
      if (scal4) {
        const data = value / scal4
        const dataround = (data == 'Infinity' || data == 'NaN') ? '' : parseFloat(Math.round(data * 100) / 100).toFixed(2)
        this.setState({ costm4: dataround })
      }
    }
    if (name == 'scalm2') {
      const costperinvoice = this.state.costperinvoice
      const data = costperinvoice / value
      const dataround = (data == 'Infinity' || data == 'NaN') ? '' : parseFloat(Math.round(data * 100) / 100).toFixed(2)
      this.setState({ costm2: dataround })
    }
    if (name == 'scalm3') {
      const costperinvoice = this.state.costperinvoice
      const data = costperinvoice / value
      const dataround = (data == 'Infinity' || data == 'NaN') ? '' : parseFloat(Math.round(data * 100) / 100).toFixed(2)
      this.setState({ costm3: dataround })
    }
    if (name == 'scalm4') {
      const costperinvoice = this.state.costperinvoice
      const data = costperinvoice / value
      const dataround = (data == 'Infinity' || data == 'NaN') ? '' : parseFloat(Math.round(data * 100) / 100).toFixed(2)
      this.setState({ costm4: dataround })
    }
  }


  handleDataVendor(data) {
    this.setState({
      fromVendor: data
    })
  }

  handlePopSubmit(e) {
    e.preventDefault()
    const data = this.state.fromVendor
    this.setState({ vendor: data['vendor_id'], vendorname: data['vendor_name'], fromVendor: '' })
    $('#myModalVendor').modal('hide');
  }

  handleAddSubmit(e) {
    const { stock_code, description, postinginterval, vendor, costperinvoice, screen_id } = this.state
    const { unitm2, scalm2, costm2, unitm3, scalm3, costm3, unitm4, scalm4, costm4 } = this.state
    const { dispatch } = this.props
    this.setState({
      errorstock_code: (stock_code) ? '' : 'The stock code is required',
      errordescription: (description) ? '' : 'The description is required',
      errorvendor: (vendor) ? '' : 'The vendor is required',
      errorcostperinvoice: (costperinvoice) ? '' : 'The cost per invoice unit is required',
      errorunitm2: (unitm2) ? '' : 'The unit is required',
      errorscalm2: (scalm2) ? '' : 'The scal is required',
      errorcostm2: (costm2) ? '' : 'The cost is required',
      errorunitm3: (unitm3) ? '' : 'The unit is required',
      errorscalm3: (scalm3) ? '' : 'The scal is required',
      errorcostm3: (costm3) ? '' : 'The cost is required',
      errorunitm4: (unitm4) ? '' : 'The unit is required',
      errorscalm4: (scalm4) ? '' : 'The scal is required',
      errorcostm4: (costm4) ? '' : 'The cost is required',
    })

    if (stock_code && description && vendor && costperinvoice && unitm2 && scalm2 && costm2 && unitm3 && scalm3 && costm3 && unitm4 && scalm4 && costm4) {
      const prm = {
        stock_code: stock_code,
        description: description,
        postinginterval: postinginterval,
        vendor: vendor,
        costperinvoice: costperinvoice,
        unitm2: unitm2,
        scalm2: scalm2,
        costm2: costm2,
        unitm3: unitm3,
        scalm3: scalm3,
        costm3: costm3,
        unitm4: unitm4,
        scalm4: scalm4,
        costm4: costm4,
        screen_id: screen_id
      }
      dispatch(inventoryActions.addnewinventoryitems(prm))
      setTimeout(function () {
        self.setState({ submitted: true })
      }, 500)
    }
  }



  async componentDidMount() {

  }

  render() {
    const self = this
    const { screen_id } = this.state
    const { stock_code, description, postinginterval, vendor, vendorname, costperinvoice } = this.state
    const { errorstock_code, errordescription, errorvendor, errorcostperinvoice } = this.state

    const { unitm2, scalm2, costm2, unitm3, scalm3, costm3, unitm4, scalm4, costm4 } = this.state
    const { errorunitm2, errorscalm2, errorcostm2, errorunitm3, errorscalm3, errorcostm3, errorunitm4, errorscalm4, errorcostm4 } = this.state
    const { modify, screen_name } = this.props

    return (
      <div id="content">
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12">
              <JarvisWidget editbutton={false} colorbutton={false} deletebutton={false} togglebutton={false} color="darken">
                <header><h2>{screen_name}</h2>
                </header>
                {modify && <div>
                  <div className="widget-body no-padding">
                    <Datatable
                      screen_id={screen_id}
                      screen_name={screen_name}
                      options={{
                        colReorder: true,
                        ajax: `${PathBackEnd}/api/newinventoryitems`,
                        columns: [{ data: "INV_ITEM" }, { data: "STOCK_NUM" }, { data: "VENDOR_NAME" }, { data: "INV_ITEM_DESC" }],
                        buttons: [
                          {
                            text: `<span ><i class="fa fa-plus" /><span class="hidden-mobile"> Add</span></span>`,
                            className: `btn btn-primary btn-sm ${(modify.can_add == "Y") ? '' : 'hidden'}`,
                            action: function (e, dt, node, config) {
                              $("#myModalAdd").modal()
                              self.setState({ tabIndex: 0, stock_code: '', description: '', postinginterval: '', vendor: '', vendorname: '', costperinvoice: '', unitm2: '', scalm2: '', costm2: '', unitm3: '', scalm3: '', costm3: '', unitm4: '', scalm4: '', costm4: '' })
                              self.setState({ errorstock_code: '', errordescription: '', errorvendor: '', errorcostperinvoice: '', errorunitm2: '', errorscalm2: '', errorcostm2: '', errorunitm3: '', errorscalm3: '', errorcostm3: '', errorunitm4: '', errorscalm4: '', errorcostm4: '' })
                            }
                          },
                        ],
                      }}
                      paginationLength={true} className="table table-striped table-bordered table-hover"
                      width="100%">
                      <thead>
                        <tr>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Inven Item
                          </th>
                          <th data-class="expand"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Stock Code
                            </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Vendor Name
                          </th>
                          <th data-hide="user"><i
                            className="text-muted hidden-md hidden-sm hidden-xs" />
                            Description
                          </th>
                        </tr>
                      </thead>
                    </Datatable>
                  </div>
                </div>
                }
              </JarvisWidget>
            </article>
          </div>
        </WidgetGrid>

        {/* Modal Add */}

        <div className="modal fade" id="myModalAdd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <div className="modal-dialog">
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
                    <div className="col-md-4 form-group">
                      <label htmlFor="stock_code"> Stock Code</label><span class="text-danger">*</span>
                      <input type="text" name="stock_code" value={stock_code} onChange={this.handleChange} className="form-control" placeholder="Stock Code" />
                      <span className="text-danger">{errorstock_code}</span>
                    </div>
                    <div className="col-md-4 form-group">
                      <label htmlFor="description"> Description</label><span class="text-danger">*</span>
                      <input type="text" name="description" value={description} onChange={this.handleChange} className="form-control" placeholder="Description" />
                      <span className="text-danger">{errordescription}</span>
                    </div>
                    <div className="col-md-4 form-group">
                      <label htmlFor="postinginterval"> Posting Interval</label>
                      <input type="text" name="postinginterval" value={postinginterval} onChange={this.handleChange} className="form-control" placeholder="Posting Interval" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 form-group">
                      <label htmlFor="vendor"> Vendor</label><span class="text-danger">*</span>
                      <div className="input-group">
                        <input type="text" name="store_id" value={vendor} onChange={this.handleChange} className="form-control" placeholder="Vendor" disabled={true} />
                        <span class="input-group-btn">
                          <a className="btn btn-primary" id="btn-chat" data-toggle="modal" data-target="#myModalVendor">
                            <i className="fa fa-user-md"></i>
                          </a>
                        </span>
                      </div>
                      <span className="text-danger">{errorvendor}</span>
                    </div>
                    <div className="col-md-4 form-group">
                      <label htmlFor="vendorname"> Vendor Name</label>
                      <input type="text" name="vendor" value={vendorname} className="form-control" placeholder="Vendor Name" disabled={true} />
                    </div>
                    <div className="col-md-4 form-group">
                      <label htmlFor="costperinvoice"> Cost Per Invoice Unit</label><span class="text-danger">*</span>
                      <input type="number" name="costperinvoice" value={costperinvoice} onChange={this.handleChange} className="form-control" placeholder="Cost Per Invoice Unit" />
                      <span className="text-danger">{errorcostperinvoice}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="no-padding">
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex, edit: false })}>
                  <TabList>
                    <Tab>U/M2</Tab>
                    <Tab>U/M3</Tab>
                    <Tab>U/M4</Tab>
                  </TabList>
                  <TabPanel>
                    <div className="modal-body">
                      <div class="form-group">
                        <div className="row">
                          <div className="col-md-4 form-group">
                            <label htmlFor="unitm2"> Unit</label><span class="text-danger">*</span>
                            <input type="text" name="unitm2" value={unitm2} onChange={this.handleChange} className="form-control" placeholder="Unit" />
                            <span className="text-danger">{errorunitm2}</span>
                          </div>
                          <div className="col-md-4 form-group">
                            <label htmlFor="scalm2"> Scal</label><span class="text-danger">*</span>
                            <input type="number" name="scalm2" value={scalm2} onChange={this.handleChange} className="form-control" placeholder="Scal" />
                            <span className="text-danger">{errorscalm2}</span>
                          </div>
                          <div className="col-md-4 form-group">
                            <label htmlFor="costm2"> Cost</label><span class="text-danger">*</span>
                            <input type="text" name="costm2" value={costm2} onChange={this.handleChange} className="form-control" disabled={true} />
                            <span className="text-danger">{errorcostm2}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="modal-body">
                      <div class="form-group">
                        <div className="row">
                          <div className="col-md-4 form-group">
                            <label htmlFor="unitm3"> Unit</label><span class="text-danger">*</span>
                            <input type="text" name="unitm3" value={unitm3} onChange={this.handleChange} className="form-control" placeholder="Unit" />
                            <span className="text-danger">{errorunitm3}</span>
                          </div>
                          <div className="col-md-4 form-group">
                            <label htmlFor="scalm3"> Scal</label><span class="text-danger">*</span>
                            <input type="number" name="scalm3" value={scalm3} onChange={this.handleChange} className="form-control" placeholder="Scal" />
                            <span className="text-danger">{errorscalm3}</span>
                          </div>
                          <div className="col-md-4 form-group">
                            <label htmlFor="costm3"> Cost</label><span class="text-danger">*</span>
                            <input type="text" name="costm3" value={costm3} onChange={this.handleChange} className="form-control" disabled={true} />
                            <span className="text-danger">{errorcostm3}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="modal-body">
                      <div class="form-group">
                        <div className="row">
                          <div className="col-md-4 form-group">
                            <label htmlFor="unitm4"> Unit</label><span class="text-danger">*</span>
                            <input type="text" name="unitm4" value={unitm4} onChange={this.handleChange} className="form-control" placeholder="Unit" />
                            <span className="text-danger">{errorunitm4}</span>
                          </div>
                          <div className="col-md-4 form-group">
                            <label htmlFor="scalm4"> Scal</label><span class="text-danger">*</span>
                            <input type="number" name="scalm4" value={scalm4} onChange={this.handleChange} className="form-control" placeholder="Scal" />
                            <span className="text-danger">{errorscalm4}</span>
                          </div>
                          <div className="col-md-4 form-group">
                            <label htmlFor="costm4"> Cost</label><span class="text-danger">*</span>
                            <input type="text" name="costm4" value={costm4} onChange={this.handleChange} className="form-control" disabled={true} />
                            <span className="text-danger">{errorcostm4}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
              <div className="modal-footer">
                <button type="button" type="submit" onClick={this.handleAddSubmit} className="btn btn-primary">
                  Save
                </button>
                <button type="button" className="btn btn-default" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Vendor */}
        <div className="modal fade" id="myModalVendor" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <form id="pop-form" onSubmit={this.handlePopSubmit}>
            <div className="modal-dialog ">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                    &times;</button>
                  <h4 className="modal-title" id="myModalLabel">{screen_name}</h4>
                </div>
                <div className="no-padding">
                  {modify && <PopupVendorForNewInventoryItems handlerFromParant={this.handleDataVendor}
                    options={{
                      colReorder: true,
                      ajax: `${PathBackEnd}/api/newinventoryitems/popupvendor`,
                      columns: [{ data: "VENDOR" }, { data: "VENDOR_NAME" }
                      ],
                    }}
                    paginationLength={true} className="table table-striped table-bordered table-hover"
                    width="100%">
                    <thead>
                      <tr>
                        <th data-hide="user"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Vendor Code
                          </th>
                        <th data-class="expand"><i
                          className=" text-muted hidden-md hidden-sm hidden-xs" />
                          Vendor Name
                          </th>
                      </tr>
                    </thead>
                  </PopupVendorForNewInventoryItems>
                  }
                </div>
                <div className="modal-footer">
                  <button type="button" type="submit" className="btn btn-primary">
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

const connectedNewInventroyItems = connect(mapStateToProps)(NewInventroyItems);
export default connectedNewInventroyItems