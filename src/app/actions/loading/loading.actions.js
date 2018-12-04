import {loadingConstants} from '../../constants'

export const loadingActions = {
    request,
    success,
    failure   
}

function request(message) {
    return { type: loadingConstants.LOADING_REQUEST, message };
}

function success(message) {
    return { type: loadingConstants.LOADING_SUCCESS, message };
}

function failure(message) {       
    return { type: loadingConstants.LOADING_FAILURE, message };   
}
