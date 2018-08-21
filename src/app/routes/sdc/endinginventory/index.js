import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/EndingInventory',
      getComponent(nextState, cb) {
        System.import('./containers/EndingInventory').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
