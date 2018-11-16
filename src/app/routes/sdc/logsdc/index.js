import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/LogSDC',
      getComponent(nextState, cb) {
        System.import('./containers/LogSDC').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
