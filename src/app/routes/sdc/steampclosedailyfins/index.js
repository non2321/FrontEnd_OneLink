import connectedLayout from '../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/SteampCloseDailyFins',
      getComponent(nextState, cb) {
        System.import('./containers/SteampCloseDailyFins').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]
};
