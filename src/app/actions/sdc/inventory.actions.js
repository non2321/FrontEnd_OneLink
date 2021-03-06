import { inventoryConstants } from '../../constants';
import { inventoryService } from '../../services/sdc'
import { alertActions } from '../alert';
import { loadingActions } from '../loading'
import { hashHistory } from 'react-router'

export const inventoryActions = {
    addaccountcodeforinventory,   
    editaccountcodeforinventory,
    downloadtemplateaccountcodeforinventory,
    importaccountcodeforinventory,

    addtermclosing,
    edittermclosing,

    editunitcost,
    downloadtemplateunitcost,
    importunitcost,
    genunitcost,

    stampinventory,

    addnewinventoryitems
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

function downloadtemplateaccountcodeforinventory() {
    inventoryService.downloadtemplateaccountcodeforinventory()
}

function importaccountcodeforinventory(obj, screen_id) {
    return dispatch => {
        dispatch(request({ obj }));
        inventoryService.importaccountcodeforinventory(obj, screen_id)
            .then(
                inventory => {
                    if (inventory.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(inventory));
                        dispatch(alertActions.success(inventory.message));                        
                    } else if (inventory.status == 'NA') {
                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                    }
                },
                error => {
                }
            )
    }
    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}

function addtermclosing(prm) {
    const year = prm.year    
    const screen_id = prm.screen_id
    

    return dispatch => {    
        //add-form   
        $('#btnsubmit').button('loading');
        dispatch(request({ year }));
        inventoryService.addtermclosing(prm)
            .then(
                inventory => {
                    if (inventory.status == 'Y') {
                        $('#btnsubmit').button('reset');
                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(inventory));
                        dispatch(alertActions.success(inventory.message));
                    } else if (inventory.status == 'NA') {

                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#btnsubmit').button('reset');
                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                    }
                },
                error => {
                    $('#btnsubmit').button('reset');
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}

function edittermclosing(obj) {

    return dispatch => {
        dispatch(request({ obj }));
        inventoryService.edittermclosing(obj)
            .then(
                inventory => {                    
                    if (inventory.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(inventory));
                        dispatch(alertActions.success(inventory.message));
                    } else if (inventory.status == 'NA') {

                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                    }
                },
                error => {
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } } 
}

function editunitcost(obj) {
    return dispatch => {
        dispatch(request({ obj }));
        inventoryService.editunitcost(obj)
            .then(
                inventory => {
                    if (inventory.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(inventory));
                        dispatch(alertActions.success(inventory.message));
                    } else if (inventory.status == 'NA') {

                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                    }
                },
                error => {
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}

function downloadtemplateunitcost() {
    inventoryService.downloadtemplateunitcost()
}

function importunitcost(obj, screen_id) {
    return dispatch => {
        dispatch(request({ obj }));
        dispatch(loadingActions.request('Loading Please Wait...'))
        inventoryService.importunitcost(obj, screen_id)
            .then(
                inventory => {
                    if (inventory.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(inventory));
                        dispatch(alertActions.success(inventory.message));  
                        dispatch(loadingActions.success(''))                      
                    } else if (inventory.status == 'NA') {
                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        dispatch(loadingActions.success(''))
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(inventory.message));
                        dispatch(alertActions.error(inventory.message));
                        dispatch(loadingActions.success(''))
                    }
                },
                error => {
                }
            )
    }
    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}

function genunitcost(prm) {
    const period = prm.period    
    const screen_id = prm.screen_id

    return dispatch => {       
        $('#btnGen').button('loading');
        dispatch(request({ period }));
        inventoryService.genunitcost(prm)
            .then(
                inventory => {                   
                    if (inventory > 0) {  
                        $('#btnGen').button('reset');                    
                        $('#myModalGenPHInventory').modal('hide');
                        dispatch(success(inventory));
                        dispatch(alertActions.success("Generate Success"));
                    } else if (inventory == 0) {
                        $('#btnGen').button('reset');     
                        dispatch(failure(inventory));
                        dispatch(alertActions.error("Generate Fail"));
                    } else {                       
                        $('#myModalGenPHInventory').modal('hide');
                        dispatch(alertActions.error(inventory.message));
                        dispatch(failure(inventory.message));
                        hashHistory.push('/Login');
                    }                    
                },
                error => {
                    $('#btnGen').button('reset');     
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}

function stampinventory(prm) {
    const stamp = prm.stamp
    const post_date_type = prm.post_date_type
    const datefrom = prm.datefrom
    const dateto = prm.dateto   
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ stamp }));
        inventoryService.stampinventory(prm)
            .then(
                inventory => {                   
                    if (inventory.status == 'Y') {          
                        dispatch(success(inventory));
                        dispatch(alertActions.bigsuccess(inventory.message));
                    } else if (inventory.status == 'NA') {
                        dispatch(failure(inventory));
                        dispatch(alertActions.error(inventory.message));
                        hashHistory.push('/Login');
                    } else {
                        dispatch(alertActions.bigerror(inventory.message));
                        dispatch(failure(inventory.message));                        
                    }                    
                },
                error => {
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(inventory) { return { type: inventoryConstants.ADD_REQUEST, inventory } }
    function success(inventory) { return { type: inventoryConstants.ADD_SUCCESS, inventory } }
    function failure(error) { return { type: inventoryConstants.ADD_FAILURE, error } }
}

function addnewinventoryitems(prm) {  

    return dispatch => {
        dispatch(request({ prm }));
        inventoryService.addnewinventoryitems(prm)
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