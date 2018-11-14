import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/GenerateG1ToE1',
      getComponent(nextState, cb) {
        System.import('./containers/GenerateG1ToE1').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
