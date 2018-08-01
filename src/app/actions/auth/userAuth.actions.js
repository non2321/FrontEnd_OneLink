import { loadpageConstants } from '../../constants';
import { authService } from '../../services';
import { alertActions } from '../alert';
import { hashHistory } from 'react-router'
export const userAuth = {
    loadpage
};


function loadpage(prm) {   
      return dispatch => { 
        dispatch(request());       
        authService.loadpage(prm)
            .then(
                auth => { 
                    if (auth.status == 'Y') {                       
                        dispatch(success(auth));
                        // dispatch(alertActions.success(user.message));                                             
                    } else if (auth.status == 'NA') {

                        dispatch(failure(auth.message));
                        dispatch(alertActions.error(auth.message));
                        hashHistory.push('/Login');
                    } else {                   

                        dispatch(failure(auth.message));                      
                        dispatch(alertActions.error(auth.message));
                        hashHistory.push('/Login');  
                    }       
                },
                error => { 
                    dispatch(failure(error));                   
                    dispatch(alertActions.error(error));                  
                }
            );
    }

    function request() { return { type: loadpageConstants.LOADPAGE_REQUEST } }
    function success(auth) { return { type: loadpageConstants.LOADPAGE_SUCCESS, auth } }
    function failure(error) { return { type: loadpageConstants.LOADPAGE_FAILURE, error } }
}