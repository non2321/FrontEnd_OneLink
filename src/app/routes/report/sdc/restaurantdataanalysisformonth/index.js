import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportRestaurantDataAnalysisForMonth',
      getComponent(nextState, cb) {
        System.import('./containers/RestaurantDataAnalysisForMonth').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
