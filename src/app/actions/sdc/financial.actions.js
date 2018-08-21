import { financialConstants } from '../../constants';
import { financialService } from '../../services/sdc'
import { alertActions } from '../alert';
import { hashHistory } from 'react-router'

export const financialActions = {
    editfinancialcode,

    addbankaccount,
    editbankaccount,
    deletebankaccount,

    addaccountforsale,
    editaccountforsale,

    downloadtemplatebankin,
    editbankinadjustment,
    importbankinadjustment,
    glprocessbankinadjustment,

    stampclosedailyfins
}

function editfinancialcode(obj) {

    return dispatch => {
        dispatch(request({ obj }));
        financialService.editfinancialcode(obj)
            .then(
                financial => {
                    if (financial.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } } return dispatch => {
        dispatch(request({ obj }));
        financialService.editfinancialcode(obj)
            .then(
                financial => {
                    if (financial.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function addbankaccount(prm) {
    const bank_code = prm.bank_code
    const bank_name = prm.bank_name
    const bank_branch = prm.bank_branch
    const account_code = prm.account_code
    const screen_id = prm.screen_id

    return dispatch => {
        // $("#btnAdd").setAttribute("disabled", "disabled")
        dispatch(request({ bank_code }))              
        financialService.addbankaccount(prm)
            .then(
                financial => {
                    if (financial.status == 'Y') {
                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {
                        // $("#btnAdd").removeAttribute("disabled");
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function editbankaccount(prm) {
    const bank_code = prm.bank_code
    const bank_name = prm.bank_name
    const bank_branch = prm.bank_branch
    const account_code = prm.account_code
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ bank_code }));
        financialService.editbankaccount(prm)
            .then(
                financial => {
                    if (financial.status == 'Y') {

                        $('#myModalEdit').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function deletebankaccount(prm) {
    const bank_code = prm.bank_code
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ bank_code }))
        financialService.deletebankcode(prm)
            .then(
                financial => {
                    if (financial.status == 'Y') {

                        $('#table').DataTable().ajax.reload();

                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function addaccountforsale(prm) {
    const formular_name = prm.formular_name
    const account_code = prm.account_code
    const bu_type = prm.bu_type
    const type = prm.type
    const subledger_type = prm.subledger_type
    const subledger = prm.subledger
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ formular_name }))
        financialService.addaccountforsale(prm)
            .then(
                financial => {
                    if (financial.status == 'Y') {

                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function editaccountforsale(prm) {
    const formular_id = prm.formular_id
    const formular_name = prm.formular_name
    const account_code = prm.account_code
    const bu_type = prm.bu_type
    const type = prm.type
    const subledger_type = prm.subledger_type
    const subledger = prm.subledger
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ formular_id }))
        financialService.editaccountforsale(prm)
            .then(
                financial => {
                    if (financial.status == 'Y') {

                        $('#myModalEdit').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.EDIT_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.EDIT_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.EDIT_FAILURE, error } }
}

function downloadtemplatebankin() {
    financialService.downloadtemplatebankin()
}

function editbankinadjustment(obj) {
    return dispatch => {
        dispatch(request({ obj }));
        financialService.editbankinadjustment(obj)
            .then(
                financial => {
                    if (financial.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                    } else if (financial.status == 'NA') {

                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function importbankinadjustment(obj, screen_id) {
    return dispatch => {
        dispatch(request({ obj }));
        financialService.importbankinadjustment(obj, screen_id)
            .then(
                financial => {
                    if (financial.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                        // $('#myModalUpload').modal('hide');
                    } else if (financial.status == 'NA') {
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                    }
                },
                error => {
                }
            )
    }
    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function glprocessbankinadjustment(prm) {
    const gldoc_type = prm.gldoc_type
    const glledger_type = prm.glledger_type
    const glfrom_date = prm.glfrom_date
    const glto_date = prm.glto_date
    const glfrom_store = prm.glfrom_store
    const glto_store = prm.glto_store
    const screen_id = prm.screen_id

    return dispatch => {       
        $('#btnGengl').button('loading');
        dispatch(request({ gldoc_type }));
        financialService.glprocessbankinadjustment(prm)
            .then(
                financial => {                   
                    if (financial > 0) {  
                        $('#btnGengl').button('reset');                    
                        $('#myModalGL').modal('hide');
                        dispatch(success(financial));
                        dispatch(alertActions.success("Generate Success"));
                    } else if (financial == 0) {
                        $('#btnGengl').button('reset');     
                        dispatch(failure(financial));
                        dispatch(alertActions.error("Generate Fail"));
                    } else {                       
                        $('#myModalGL').modal('hide');
                        dispatch(alertActions.error(financial.message));
                        dispatch(failure(financial.message));
                        hashHistory.push('/Login');
                    }                    
                },
                error => {
                    $('#btnGengl').button('reset');     
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}

function stampclosedailyfins(prm) {
    const stamp = prm.stamp
    const datefrom = prm.datefrom
    const dateto = prm.dateto   
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ stamp }));
        financialService.stampclosedailyfins(prm)
            .then(
                financial => {                   
                    if (financial.status == 'Y') {          
                        dispatch(success(financial));
                        dispatch(alertActions.bigsuccess(financial.message));
                    } else if (financial.status == 'NA') {
                        dispatch(failure(financial));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {
                        dispatch(alertActions.bigerror(financial.message));
                        dispatch(failure(financial.message));                        
                    }                    
                },
                error => {
                    // dispatch(failure(error));
                    // dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}



