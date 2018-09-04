import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/TermClosing',
      getComponent(nextState, cb) {
        System.import('./containers/TermClosing').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
