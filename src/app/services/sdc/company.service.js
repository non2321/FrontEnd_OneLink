import { authHeader } from '../../store';
import { localStorageAuth, PathBackEnd } from '../../../../settings'
import 'isomorphic-fetch'

export const companyService = {
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

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_code, company_name, screen_id })
    };

    return fetch(`${PathBackEnd}/api/companyconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }

            return user;
        });
}

function editcompany(prm) {
    const company_id = prm.company_id
    const company_code = prm.company_code
    const company_name = prm.company_name
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id, company_code, company_name, screen_id })
    };

    return fetch(`${PathBackEnd}/api/companyconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.status == 'Y') {                
                // store user details and jwt token in local storage to keep user logged in between page refreshes               
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }

            return user;
        });
}

function deletecompany(prm) {
    const company_id = prm.company_id
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id, screen_id })
    };

    return fetch(`${PathBackEnd}/api/companyconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.status == 'Y') {               
                // store user details and jwt token in local storage to keep user logged in between page refreshes               
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }

            return user;
        });
}

function addcompanyaccount(prm) {
    const company_code = prm.company_code
    const company_name = prm.company_name
    const report_name = prm.report_name
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_code, company_name, report_name, screen_id })
    };

    return fetch(`${PathBackEnd}/api/companyaccountconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes

                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }

            return user;
        });
}

function editcompanyaccount(prm) {
    const company_id = prm.company_id
    const company_code = prm.company_code
    const company_name = prm.company_name
    const report_name = prm.report_name
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id, company_code, company_name, report_name, screen_id })
    };

    return fetch(`${PathBackEnd}/api/companyaccountconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes               
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }

            return user;
        });
}

function deletecompanyaccount(prm) {
    const company_id = prm.company_id
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id, screen_id })
    };

    return fetch(`${PathBackEnd}/api/companyaccountconfig`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.status == 'Y') {
                // store user details and jwt token in local storage to keep user logged in between page refreshes               
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
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