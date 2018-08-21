import { inventoryConstants } from '../../constants';
import { inventoryService } from '../../services/sdc'
import { alertActions } from '../alert';
import { hashHistory } from 'react-router'

export const inventoryActions = {
    addaccountcodeforinventory,   
    editaccountcodeforinventory
}

function addaccountcodeforinventory(prm) {
    const action_code = prm.action_code
    const inv_class = prm.inv_class
    const action = prm.action
    const obj_account = prm.obj_account
    const subsidary = prm.subsidary
    const grp_by = prm.grp_by
    const cat_code = prm.cat_code
    const acc_type = prm.acc_type
    const doc_no = prm.doc_no
    const remark = prm.remark
    const screen_id = prm.screen_id
    

    return dispatch => {
        dispatch(request({ action_code }));
        inventoryService.addaccountcodeforinventory(prm)
            .then(
                inventory => {
                    if (inventory.status == 'Y') {
                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(inventory));
                        dispatch(alertActions.success(inventory.message));
                    } else if (inventory.status == 'NA') {

                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}

function editaccountcodeforinventory(prm) {
    const action_code = prm.action_code
    const inv_class = prm.inv_class
    const action = prm.action
    const obj_account = prm.obj_account
    const subsidary = prm.subsidary
    const grp_by = prm.grp_by
    const cat_code = prm.cat_code
    const acc_type = prm.acc_type
    const doc_no = prm.doc_no
    const remark = prm.remark
    const screen_id = prm.screen_id
    
    return dispatch => {
        dispatch(request({ action_code }));
        inventoryService.editaccountcodeforinventory(prm)
            .then(
                inventory => {
                    if (inventory.status == 'Y') {
                        $('#myModalEdit').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(inventory));
                        dispatch(alertActions.success(inventory.message));
                    } else if (inventory.status == 'NA') {

                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}