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
        console.log(5555)      
        dispatch(request({ stamp }))          
        reportsdcService.exportdailyflashsales(prm)
            .then(
                report => {
                    if (report.status == 'Y') {  
                        dispatch(success(report.data))
                        dispatch(alertActions.success(report.message))
                    } else if (report.status == 'NA') {   
                        dispatch(failure(report.message));
                        dispatch(alertActions.error(report.message))
                        hashHistory.push('/Login');
                    } else if (report.status == 'W') {                                               
                        dispatch(failure(report.message))
                        dispatch(alertActions.warning(report.message))
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
    }

    function request(report) { return { type: reportConstants.EXPORT_REQUEST, report } }
    function success(report) { return { type: reportConstants.EXPORT_SUCCESS, report } }
    function failure(error) { return { type: reportConstants.EXPORT_FAILURE, error } }
}