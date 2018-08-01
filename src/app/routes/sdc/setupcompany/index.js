import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SetupCompany',
      getComponent(nextState, cb) {
        System.import('./containers/SetupCompany').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
