import { combineReducers } from 'redux';

import {routerReducer} from 'react-router-redux'
import {layoutReducer} from '../components/layout'
import navigationReducer from '../components/navigation/navigationReducer'

import { authenticationreducers } from './authentication.reducer';
import { alertreducers } from './alert.reducer'
import { loadpagereducers } from './loadpage.reducer'
import { loadingreducers } from './loading.reducer'
import { reportreducers } from './report.reducer'

const rootReducer = combineReducers({
  routing: routerReducer,
  layout: layoutReducer,
  navigation: navigationReducer,
  authentication: authenticationreducers,
  alert: alertreducers,
  loadpage: loadpagereducers, 
  loading: loadingreducers,
  report: reportreducers
});

export default rootReducer;