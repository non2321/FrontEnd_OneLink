import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportDetailStockTransferOut',
      getComponent(nextState, cb) {
        System.import('./containers/DetailStockTransferOut').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
