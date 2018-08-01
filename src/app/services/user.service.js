import { authHeader } from '../store';
import { localStorageAuth, PathBackEnd } from '../../../settings'
import 'isomorphic-fetch'

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    getrole
};

function getrole() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };    
    return fetch(`${PathBackEnd}/api/user_role`, requestOptions).then(handleResponse);
}

function login(prm) {
    const username = prm.username
    const password = prm.password
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, screen_id })
    };

    return fetch(`${PathBackEnd}/api/login`, requestOptions)
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

function logout() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${PathBackEnd}/api/logout`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return response.json();
        })
        .then(user => {
            // remove user from local storage to log user out   
            localStorage.removeItem(localStorageAuth);

            return user;
        })
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };   
    return fetch(`${PathBackEnd}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${PathBackEnd}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${PathBackEnd}/users/register`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${PathBackEnd}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${PathBackEnd}/users/${id}`, requestOptions).then(handleResponse);;
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}