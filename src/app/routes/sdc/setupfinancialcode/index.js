import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SetupFinancialCode',
      getComponent(nextState, cb) {
        System.import('./containers/SetupFinancialCode').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
