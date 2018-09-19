import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportSummaryStockTransferOut',
      getComponent(nextState, cb) {
        System.import('./containers/SummaryStockTransferOut').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
