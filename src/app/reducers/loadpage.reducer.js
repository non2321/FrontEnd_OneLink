import { loadpageConstants } from '../constants';
//const navItems = require('../../../config/navigation.json')
// const navItems = require('../config/navigation.json')

export function loadpagereducers(state = { loading: false, user: null }, action) {
  switch (action.type) {
    case loadpageConstants.LOADPAGE_REQUEST:
      return {
        loading: true,
        user: action.auth,
      };
    case loadpageConstants.LOADPAGE_SUCCESS:   
      return {
        loading: false,
        user: action.auth,
        modify: action.auth.modify,
        screen_name: action.auth.screen_name
      };
    case loadpageConstants.LOADPAGE_FAILURE:
      return {
      };
    default:
      return state
  }
}