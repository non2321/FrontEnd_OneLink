import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportCashSalesReconcilationByStore',
      getComponent(nextState, cb) {
        System.import('./containers/CashSalesReconcilationByStore').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
