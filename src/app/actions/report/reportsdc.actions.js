import { reportConstants } from '../../constants';
import { reportsdcService } from '../../services/report'
import { alertActions } from '../alert';
import { hashHistory } from 'react-router'

export const reportsdc = {
    generatetokentableau,
    generatetokentableauforfullscreen
}

function generatetokentableau(prm) {   
    const screen_id = prm.screen_id
   
    return dispatch => {    
        dispatch(request({ screen_id }))          
        reportsdcService.generatetokentableau(prm)
            .then(
                report => {
                    if (report.status == 'Y') {  
                        dispatch(success(report.data))                       
                        // dispatch(alertActions.success(report.message))
                    } else if (report.status == 'NA') {   
                        dispatch(failure(report.message))
                        dispatch(alertActions.error(report.message))
                        hashHistory.push('/Login')                   
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

    function request(token) { return { type: reportConstants.TOKEN_REQUEST, token } }
    function success(token) { return { type: reportConstants.TOKEN_SUCCESS, token } }
    function failure(token) { return { type: reportConstants.TOKEN_FAILURE, error } }
}

function generatetokentableauforfullscreen(prm) {   
    const screen_id = prm.screen_id
   
    return dispatch => {    
        dispatch(request({ screen_id }))          
        reportsdcService.generatetokentableauforfullscreen(prm)
            .then(
                report => {
                    if (report.status == 'Y') {  
                        dispatch(success(report.data)) 
                    } else if (report.status == 'NA') {   
                        dispatch(failure(report.message))
                        dispatch(alertActions.error(report.message))
                        hashHistory.push('/Login')                   
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

    function request(token) { return { type: reportConstants.TOKEN_REQUEST, token } }
    function success(token) { return { type: reportConstants.TOKEN_SUCCESS, token } }
    function failure(token) { return { type: reportConstants.TOKEN_FAILURE, error } }
}