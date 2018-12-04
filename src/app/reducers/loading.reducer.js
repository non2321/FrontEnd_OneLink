import { loadingConstants } from '../constants';

export function loadingreducers(state = { loading: false }, action) {
  switch (action.type) {
    case loadingConstants.LOADING_REQUEST:
      return {
        loading: true,
        message: action.message,
        status: true
      };
    case loadingConstants.LOADING_SUCCESS:
      return {
        loading: false,
        message: action.message,
        status: true
      };
    case loadingConstants.LOADING_FAILURE:
      return {
        loading: false,
        message: action.message,
        status: false
      };
    default:
      return state
  }
}