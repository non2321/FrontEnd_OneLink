import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SetupCompanyAccount',
      getComponent(nextState, cb) {
        System.import('./containers/SetupCompanyAccount').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
