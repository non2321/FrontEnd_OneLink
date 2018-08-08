import { authHeader } from '../store';
import { localStorageAuth, PathBackEnd } from '../../../settings'
import 'isomorphic-fetch'

export const authService = {
    loadpage,
    loadMenuByUserid
};


function loadpage(prm) {    
    const screen_id = prm.screen_id
  
    const requestOptions = {
        method: 'POST',        
        headers: { ...authHeader(),'Content-Type': 'application/json'},
        body: JSON.stringify({ screen_id })
    };
    
    return fetch(`${PathBackEnd}/api/loadpage`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }            
            return response.json();
        })
        .then(auth => {          
            if (auth  && auth.status == 'Y') {                                  
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem(localStorageAuth, JSON.stringify(auth.user));
            }

            return auth;
        });
}

function loadMenuByUserid(_userid){
    const requestOptions = {
        method: 'GET',
    };
    return fetch(`${PathBackEnd}/api/menuauth/${_userid}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {   
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }   
    return response.json();
}