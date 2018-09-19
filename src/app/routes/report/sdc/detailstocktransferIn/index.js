import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportDetailStockTransferIn',
      getComponent(nextState, cb) {
        System.import('./containers/DetailStockTransferIn').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
