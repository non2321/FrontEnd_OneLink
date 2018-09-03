import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/TransferInventory',
      getComponent(nextState, cb) {
        System.import('./containers/TransferInventory').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
