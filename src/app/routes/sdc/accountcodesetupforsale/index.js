import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/AccountCodeSetupForSale',
      getComponent(nextState, cb) {
        System.import('./containers/AccountCodeSetupForSale').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
