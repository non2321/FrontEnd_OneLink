import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/AccountCodeForInventory',
      getComponent(nextState, cb) {
        System.import('./containers/AccountCodeForInventory').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
