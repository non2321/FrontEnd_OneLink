import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/Receipts',
      getComponent(nextState, cb) {
        System.import('./containers/Receipts').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
