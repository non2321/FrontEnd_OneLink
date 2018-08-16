import { authHeader } from '../../store';
import { localStorageAuth, PathBackEnd } from '../../../../settings'
import 'isomorphic-fetch'

export const reportsdcService = {
    generatetokentableau,
}

function generatetokentableau(prm) {
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ screen_id })
    };
  
    return fetch(`${PathBackEnd}/api/report/gentokentableau`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {

            // login successful if there's a jwt token in the response
            if (user && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        })
}


function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}