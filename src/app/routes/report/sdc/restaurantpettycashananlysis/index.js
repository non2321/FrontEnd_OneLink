import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportRestaurantPettyCashAnanlysis',
      getComponent(nextState, cb) {
        System.import('./containers/RestaurantPettyCashAnanlysis').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
