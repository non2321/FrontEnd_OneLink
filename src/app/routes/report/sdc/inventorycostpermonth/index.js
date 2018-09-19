import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportInventoryCostPerMonth',
      getComponent(nextState, cb) {
        System.import('./containers/InventoryCostPerMonth').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
