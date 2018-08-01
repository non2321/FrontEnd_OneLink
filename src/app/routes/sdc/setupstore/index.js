import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SetupStore',
      getComponent(nextState, cb) {
        System.import('./containers/SetupStore').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
