import { financialConstants } from '../../constants';
import { financialService } from '../../services/sdc'
import { alertActions } from '../alert'
import { loadingActions } from '../loading'
import { hashHistory } from 'react-router'
import delay from 'delay'


export const financialActions = {
    addfinancialcode,
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

    stampclosedailyfins,

    gendatafilePL
}

function addfinancialcode(prm) {
    const fin_code = prm.fin_code
    const fin_name = prm.fin_name
    const active = prm.active
    const show = prm.show
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ fin_code }))
        financialService.addfinancialcode(prm)
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
    const fincode = prm.fincode
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
    const fincode = prm.fincode
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
        dispatch(loadingActions.request('Loading Please Wait...'))
        financialService.importbankinadjustment(obj, screen_id)
            .then(
                financial => {
                    if (financial.status == 'Y') {
                        $('#table').DataTable().ajax.reload();
                        dispatch(success(financial));
                        dispatch(alertActions.success(financial.message));
                        dispatch(loadingActions.success(''))
                        // $('#myModalUpload').modal('hide');
                    } else if (financial.status == 'NA') {
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        dispatch(loadingActions.success(''))
                        hashHistory.push('/Login');
                    } else {
                        $('#table').DataTable().ajax.reload();
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        dispatch(loadingActions.success(''))
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

async function gendatafilePL(year, month, obj, screen_id) {
    return async dispatch => {
        dispatch(request({ obj }));
        dispatch(loadingActions.request('Loading Please Wait...'))
        let datasuccess = [], datafail = [] 
        const financial = await financialService.addgendatafilePL(year, month, obj, screen_id).catch((err) => { console.log(err) })
        if (financial) {
            const BAL = await financialService.genfileBAL(year, month, screen_id).catch((err) => { console.log(err) })
            if (BAL) {
                if (BAL > 0) {
                    dispatch(success(BAL));
                    datasuccess.push("BAL\r\n")
                } else {
                    dispatch(failure(BAL));
                    datafail.push("BAL\r\n")
                }
            }
            await delay(500)
            const BAL_ADJ = await financialService.genfileBAL_ADJ(year, month, screen_id).catch((err) => { console.log(err) })
            if (BAL_ADJ) {
                if (BAL_ADJ > 0) {
                    dispatch(success(BAL_ADJ));
                    datasuccess.push("BAL_ADJ\r\n")
                } else {
                    dispatch(failure(BAL_ADJ));
                    datafail.push("BAL_ADJ\r\n")
                }
            }
            await delay(500)
            const ACTUAL = await financialService.genfileBAL_ACTUAL(year, month, screen_id).catch((err) => { console.log(err) })
            if (ACTUAL) {
                if (ACTUAL > 0) {
                    dispatch(success(ACTUAL));
                    datasuccess.push("ACTUAL\r\n")
                } else {
                    dispatch(failure(ACTUAL));
                    datafail.push("ACTUAL\r\n")
                }
            }
            await delay(500)
            const ACTUAL_ADJ = await financialService.genfileBAL_ACTUAL_ADJ(year, month, screen_id).catch((err) => { console.log(err) })
            if (ACTUAL_ADJ) {
                if (ACTUAL_ADJ > 0) {
                    dispatch(success(ACTUAL_ADJ));
                    datasuccess.push("ACTUAL_ADJ\r\n")
                } else {
                    dispatch(failure(ACTUAL_ADJ));
                    datafail.push("ACTUAL_ADJ\r\n")
                }
            }
            await delay(500)
            const NetSales = await financialService.genfileBAL_NetSales(year, month, screen_id).catch((err) => { console.log(err) })
            if (NetSales) {
                if (ACTUAL_ADJ > 0) {
                    dispatch(success(NetSales));
                    datasuccess.push("NetSales\r\n")
                } else {
                    dispatch(failure(NetSales));
                    datafail.push("NetSales\r\n")
                }
            }
            await delay(500)
            const ACTUAL_SPA = await financialService.genfileBAL_ACTUAL_SPA_AND_ACTUAL_ADJ_SPA(year, month, screen_id).catch((err) => { console.log(err) })
            if (ACTUAL_SPA.obj1) {
                if (ACTUAL_SPA.obj1 > 0) {
                    dispatch(success(ACTUAL_SPA.obj1));
                    datasuccess.push("ACTUAL_SPA\r\n")
                } else {
                    dispatch(failure(ACTUAL_SPA.obj1));
                    datafail.push("ACTUAL_SPA\r\n")
                }
            }
            if (ACTUAL_SPA.obj2) {
                if (ACTUAL_SPA.obj2 > 0) {
                    dispatch(success(ACTUAL_SPA.obj2));
                    datasuccess.push("ACTUAL_ADJ_SPA\r\n")
                } else {
                    dispatch(failure(ACTUAL_SPA.obj2));
                    datafail.push("ACTUAL_ADJ_SPA\r\n")
                }
            }           
            await delay(500)
            dispatch(alertActions.success(`Generate ${datasuccess.join()} Success`))
            if (datafail.lenght > 0) {
                dispatch(alertActions.error(`Generate ${datafail.join()} Fail`))
            }
        } else if (financial.status == 'NA') {
            dispatch(failure(financial.message));
            dispatch(alertActions.error(financial.message));
            hashHistory.push('/Login');
        } else {
            dispatch(failure(financial.message));
            dispatch(alertActions.error("Generate Fail"));
        }
        dispatch(loadingActions.success(''))
    }
    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}



