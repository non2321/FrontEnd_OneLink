import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/GenDataFilePL',
      getComponent(nextState, cb) {
        System.import('./containers/GenDataFilePL').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
