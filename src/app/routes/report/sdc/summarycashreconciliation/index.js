import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportSummaryCashReconciliation',
      getComponent(nextState, cb) {
        System.import('./containers/SummaryCashReconciliation').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
