import {alertConstants} from '../../constants'

export const alertActions = {
    success,
    bigsuccess,
    error,
    bigerror,
    clear
};

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function bigsuccess(message) {
    return { type: alertConstants.BIGSUCCESS, message };
}

function error(message) {       
    return { type: alertConstants.ERROR, message };   
}

function bigerror(message) {       
    return { type: alertConstants.BIGERROR, message };   
}

function clear() {
    return { type: alertConstants.CLEAR };
}