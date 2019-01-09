import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/NewInventoryItems',
      getComponent(nextState, cb) {
        System.import('./containers/NewInventroyItems').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
