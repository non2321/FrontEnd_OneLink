import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportBankInSummaryByBank',
      getComponent(nextState, cb) {
        System.import('./containers/BankInSummaryByBank').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
