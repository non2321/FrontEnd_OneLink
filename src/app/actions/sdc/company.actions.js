import { companyConstants } from '../../constants';
import { companyService } from '../../services/sdc'
import { alertActions } from '../alert';
import { hashHistory } from 'react-router'

export const companyActions = {
    addcompany,
    editcompany,
    deletecompany,
    addcompanyaccount,
    editcompanyaccount,
    deletecompanyaccount
};

function addcompany(prm) {
    const company_code = prm.company_code
    const company_name = prm.company_name
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ company_code }));
        companyService.addcompany(prm)
            .then(
                company => {
                    if (company.status == 'Y') {

                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(company));
                        dispatch(alertActions.success(company.message));
                    } else if (company.status == 'NA') {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(company) { return { type: companyConstants.ADD_REQUEST, company } }
    function success(company) { return { type: companyConstants.ADD_SUCCESS, company } }
    function failure(error) { return { type: companyConstants.ADD_FAILURE, error } }
}

function editcompany(prm) {
    const company_id = prm.company_id
    const company_code = prm.company_code
    const company_name = prm.company_name
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ company_id }));
        companyService.editcompany(prm)
            .then(
                company => {
                    if (company.status == 'Y') {

                        $('#myModalEdit').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(company));
                        dispatch(alertActions.success(company.message));
                    } else if (company.status == 'NA') {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(company) { return { type: companyConstants.EDIT_REQUEST, company } }
    function success(company) { return { type: companyConstants.EDIT_SUCCESS, company } }
    function failure(error) { return { type: companyConstants.EDIT_FAILURE, error } }
}

function deletecompany(prm) {
    const company_id = prm.company_id
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ company_id }));
        companyService.deletecompany(prm)
            .then(
                company => {
                    if (company.status == 'Y') {

                        $('#table').DataTable().ajax.reload();

                        dispatch(success(company));
                        dispatch(alertActions.success(company.message));
                    } else if (company.status == 'NA') {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                        hashHistory.push('/Login');
                    } else {
                        
                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(company) { return { type: companyConstants.EDIT_REQUEST, company } }
    function success(company) { return { type: companyConstants.EDIT_SUCCESS, company } }
    function failure(error) { return { type: companyConstants.EDIT_FAILURE, error } }
}

function addcompanyaccount(prm) {
    const company_code = prm.company_code
    const company_name = prm.company_name
    const report_name = prm.report_name
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ company_code }));
        companyService.addcompanyaccount(prm)
            .then(
                company => {
                    if (company.status == 'Y') {

                        $('#myModalAdd').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(company));
                        dispatch(alertActions.success(company.message));
                    } else if (company.status == 'NA') {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(company) { return { type: companyConstants.ADD_REQUEST, company } }
    function success(company) { return { type: companyConstants.ADD_SUCCESS, company } }
    function failure(error) { return { type: companyConstants.ADD_FAILURE, error } }
}

function editcompanyaccount(prm) {
    const company_id = prm.company_id
    const company_code = prm.company_code
    const company_name = prm.company_name
    const report_name = prm.report_name
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ company_id }));
        companyService.editcompanyaccount(prm)
            .then(
                company => {
                    if (company.status == 'Y') {

                        $('#myModalEdit').modal('hide');
                        $('#table').DataTable().ajax.reload();

                        dispatch(success(company));
                        dispatch(alertActions.success(company.message));
                    } else if (company.status == 'NA') {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                        hashHistory.push('/Login');
                    } else {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(company) { return { type: companyConstants.EDIT_REQUEST, company } }
    function success(company) { return { type: companyConstants.EDIT_SUCCESS, company } }
    function failure(error) { return { type: companyConstants.EDIT_FAILURE, error } }
}

function deletecompanyaccount(prm) {
    const company_id = prm.company_id
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ company_id }));
        companyService.deletecompanyaccount(prm)
            .then(
                company => {
                    if (company.status == 'Y') {

                        $('#table').DataTable().ajax.reload();

                        dispatch(success(company));
                        dispatch(alertActions.success(company.message));
                    } else if (company.status == 'NA') {

                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                        hashHistory.push('/Login');
                    } else {
                        
                        dispatch(failure(company.message));
                        dispatch(alertActions.error(company.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(company) { return { type: companyConstants.EDIT_REQUEST, company } }
    function success(company) { return { type: companyConstants.EDIT_SUCCESS, company } }
    function failure(error) { return { type: companyConstants.EDIT_FAILURE, error } }
}


