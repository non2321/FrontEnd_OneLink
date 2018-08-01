import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/BankInAdjustment',
      getComponent(nextState, cb) {
        System.import('./containers/BankInAdjustment').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
