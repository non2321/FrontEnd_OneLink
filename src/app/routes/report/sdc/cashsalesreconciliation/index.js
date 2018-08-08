import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportCashSalesReconciliation',
      getComponent(nextState, cb) {
        System.import('./containers/CashSalesReconciliation').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
