import connectedLayout from '../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: 'home',
      getComponent(nextState, cb) {
        System.import('./containers/Home').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
