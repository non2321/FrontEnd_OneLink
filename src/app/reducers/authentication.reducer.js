import { userConstants } from '../constants';
import { localStorageAuth } from '../../../settings'

let user = JSON.parse(localStorage.getItem(localStorageAuth));
const initialState = user ? { loggedIn: true, user } : {};

export function authenticationreducers(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}