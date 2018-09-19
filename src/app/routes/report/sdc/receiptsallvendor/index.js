import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportReceiptsAllVendor',
      getComponent(nextState, cb) {
        System.import('./containers/ReceiptsAllVendor').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
