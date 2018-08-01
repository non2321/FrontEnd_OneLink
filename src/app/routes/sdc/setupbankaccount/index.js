import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SetupBankAccount',
      getComponent(nextState, cb) {
        System.import('./containers/SetupBankAccount').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
