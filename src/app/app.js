import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, hashHistory } from 'react-router'

// import registerServiceWorker from './registerServiceWorker';

import store from './store/configureStore'

const history = syncHistoryWithStore(hashHistory, store);


const routes = {

  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/home') },
  childRoutes: [
    //   require('./routes/dashboard').default,    
    require('./routes/auth').default,
    require('./routes/home').default,
    require('./routes/sdc/setupbankaccount').default,
    require('./routes/sdc/setupcompany').default,
    require('./routes/sdc/setupcompanyaccount').default,
    require('./routes/sdc/setupfinancialcode').default,
    require('./routes/sdc/setupstore').default,
    require('./routes/sdc/accountcodesetupforsale').default,
    require('./routes/sdc/bankinadjustment').default,
    require('./routes/sdc/steampclosedailyfins').default,
   
    
    //Report
    require('./routes/report/sdc/dailyflashsales').default,
    require('./routes/report/sdc/cashsalesreconciliation').default,
    require('./routes/report/sdc/bankinsummarybybank').default,
    require('./routes/report/sdc/cashsalesreconcilationbystore').default,
    require('./routes/report/sdc/totalpettycashreimbursementbystore').default,
    require('./routes/report/sdc/restaurantdataanalysisformonth').default,
    require('./routes/report/sdc/restaurantpettycashananlysis').default,
    require('./routes/report/sdc/summarycashreconciliation').default,
    // require('./routes/notfound').default,
    // comment unused routes
    // this will speed up builds
  ]
};

ReactDOM.render((
  <Provider store={store}>
    <Router
      history={history}
      routes={routes}
    />
  </Provider>
), document.getElementById('root'));
//  registerServiceWorker();