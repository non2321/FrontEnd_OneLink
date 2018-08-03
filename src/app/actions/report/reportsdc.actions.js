import { reportConstants } from '../../constants';
import { reportsdcService } from '../../services/report'
import { alertActions } from '../alert';
import { hashHistory } from 'react-router'

export const reportsdc = {
    exportdailyflashsales
}

function exportdailyflashsales(prm) {
    const datefrom = prm.datefrom
    const dateto = prm.dateto
    const from_store = prm.from_store
    const to_store = prm.to_store
    const stamp = prm.stamp
    const screen_id = prm.screen_id

    return dispatch => {
        dispatch(request({ stamp }))
        reportsdcService.exportdailyflashsales(prm)
            .then(
                report => {
                    if (report.status == 'Y') {
                        dispatch(success(report))
                        dispatch(alertActions.success(report.message))
                    } else if (report.status == 'NA') {
                        dispatch(failure(report.message));
                        dispatch(alertActions.error(report.message))
                        hashHistory.push('/Login');
                    } else {
                        dispatch(failure(report.message))
                        dispatch(alertActions.error(report.message))
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
        // companyService.addcompany(prm)
        //     .then(
        //         company => {
        //             if (company.status == 'Y') {

        //                 $('#myModalAdd').modal('hide');
        //                 $('#table').DataTable().ajax.reload();

        //                 dispatch(success(company));
        //                 dispatch(alertActions.success(company.message));
        //             } else if (company.status == 'NA') {

        //                 dispatch(failure(company.message));
        //                 dispatch(alertActions.error(company.message));
        //                 hashHistory.push('/Login');
        //             } else {

        //                 dispatch(failure(company.message));
        //                 dispatch(alertActions.error(company.message));
        //             }
        //         },
        //         error => {
        //             dispatch(failure(error));
        //             dispatch(alertActions.error(error));
        //         }
        //     )
    }

    function request(report) { return { type: reportConstants.EXPORT_REQUEST, report } }
    function success(report) { return { type: reportConstants.EXPORT_SUCCESS, report } }
    function failure(error) { return { type: reportConstants.EXPORT_FAILURE, error } }
}