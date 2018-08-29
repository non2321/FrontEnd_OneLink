import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ImportToJDE',
      getComponent(nextState, cb) {
        System.import('./containers/ImportToJDE').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
