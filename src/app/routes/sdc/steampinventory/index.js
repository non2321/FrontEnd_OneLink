import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SteampInventory',
      getComponent(nextState, cb) {
        System.import('./containers/SteampInventory').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
