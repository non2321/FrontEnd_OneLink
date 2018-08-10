import connectedLayout from '../../../../components/common/Layout'

export default { 
  component: connectedLayout,

  childRoutes: [
    {
      path: '/SDC/ReportTotalPettyCashReimbursementByStore',
      getComponent(nextState, cb) {
        System.import('./containers/TotalPettyCashReimbursementByStore').then((m) => {
          cb(null, m.default)
        })
      }
    },    
  ]

};
