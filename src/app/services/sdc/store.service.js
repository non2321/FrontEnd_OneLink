import { authHeader } from '../../store';
import { localStorageAuth, PathBackEnd } from '../../../../settings'
import 'isomorphic-fetch'

export const storeService = {
    addstore,
    editstore,
    deletestore
};

function addstore(prm) {
    const store_code = prm.store_code
    const bank_code = prm.bank_code
    const screen_id = prm.screen_id
   
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_code, bank_code, screen_id })
    };

    return fetch(`${PathBackEnd}/api/storeconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes

                localStorage.setItem(localStorageAuth, JSON.stringify(user));
            }

            return user;
        });
}

function editstore(prm) {
    const store_code = prm.store_code
    const bank_code = prm.bank_code
    const screen_id = prm.screen_id
   
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_code, bank_code, screen_id })
    };

    return fetch(`${PathBackEnd}/api/storeconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes

                localStorage.setItem(localStorageAuth, JSON.stringify(user));
            }

            return user;
        });
}

function deletestore(prm) {
    const store_code = prm.store_code   
    const screen_id = prm.screen_id
  
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_code, screen_id })
    };

    return fetch(`${PathBackEnd}/api/storeconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes

                localStorage.setItem(localStorageAuth, JSON.stringify(user));
            }

            return user;
        });
}




function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}