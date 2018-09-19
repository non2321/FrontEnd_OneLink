import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportReceiptsAllVendorByRegion',
      getComponent(nextState, cb) {
        System.import('./containers/ReceiptsAllVendorByRegion').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
