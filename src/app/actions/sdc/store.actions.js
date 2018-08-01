import { storeyConstants } from '../../constants';
import { storeService } from '../../services/sdc'
import { alertActions } from '../alert';
import { hashHistory } from 'react-router'

export const storeActions = {
    addstore, 
    editstore,
    deletestore
}

function addstore(prm) {
    const store_code = prm.store_code
    const bank_code = prm.bank_code
    const screen_id = prm.screen_id

    return dispatch => {      
        dispatch(request({ store_code }));
        storeService.addstore(prm)
            .then(
                store => {
                    if (store.status == 'Y') {

                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();
                        
                        setTimeout(function () { //Start the timer
                          $('#poptable').DataTable().ajax.reload();
                          }.bind(this), 500)

                        dispatch(success(store));
                        dispatch(alertActions.success(store.message));
                    } else if (store.status == 'NA') {

                        dispatch(failure(store.message));
                        dispatch(alertActions.error(store.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(store.message));
                        dispatch(alertActions.error(store.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(store) { return { type: storeyConstants.ADD_REQUEST, store } }
    function success(store) { return { type: storeyConstants.ADD_SUCCESS, store } }
    function failure(error) { return { type: storeyConstants.ADD_FAILURE, error } }
}

function editstore(prm) {
    const store_code = prm.store_code
    const bank_code = prm.bank_code
    const screen_id = prm.screen_id

    return dispatch => {      
        dispatch(request({ store_code }));
        storeService.editstore(prm)
            .then(
                store => {
                    if (store.status == 'Y') {

                        $('#myModalEdit').modal('hide');
                        $('#table').DataTable().ajax.reload();                        
                      
                        dispatch(success(store));
                        dispatch(alertActions.success(store.message));
                    } else if (store.status == 'NA') {

                        dispatch(failure(store.message));
                        dispatch(alertActions.error(store.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(store.message));
                        dispatch(alertActions.error(store.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(store) { return { type: storeyConstants.EDIT_REQUEST, store } }
    function success(store) { return { type: storeyConstants.EDIT_SUCCESS, store } }
    function failure(error) { return { type: storeyConstants.EDIT_FAILURE, error } }
}

function deletestore(prm) {
    const store_code = prm.store_code   
    const screen_id = prm.screen_id

    return dispatch => {      
        dispatch(request({ store_code }));
        storeService.deletestore(prm)
            .then(
                store => {
                    if (store.status == 'Y') {

                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();
                        
                        setTimeout(function () { //Start the timer
                          $('#poptable').DataTable().ajax.reload();
                          }.bind(this), 500)

                        dispatch(success(store));
                        dispatch(alertActions.success(store.message));
                    } else if (store.status == 'NA') {

                        dispatch(failure(store.message));
                        dispatch(alertActions.error(store.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(store.message));
                        dispatch(alertActions.error(store.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(store) { return { type: storeyConstants.ADD_REQUEST, store } }
    function success(store) { return { type: storeyConstants.ADD_SUCCESS, store } }
    function failure(error) { return { type: storeyConstants.ADD_FAILURE, error } }
}