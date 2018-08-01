import {createStore, combineReducers,  applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';

import {handleBodyClasses, dumpLayoutToStorage, layoutReducer} from '../components/layout'
import rootReducer from '../reducers';


const loggerMiddleware = createLogger();

const store =  createStore(rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
    handleBodyClasses,
    dumpLayoutToStorage,    
  )
);


export default store;