import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SDCBatchFile',
      getComponent(nextState, cb) {
        System.import('./containers/SDCBatchFile').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
