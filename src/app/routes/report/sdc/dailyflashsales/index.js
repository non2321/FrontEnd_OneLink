import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/Report/SDC/DailyFlashSales',
      getComponent(nextState, cb) {
        System.import('./containers/DailyFlashSales').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
