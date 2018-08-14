import { authHeader } from '../../store';
import { localStorageAuth, PathBackEnd } from '../../../../settings'
import 'isomorphic-fetch'

export const reportsdcService = {
    exportdailyflashsales,
};

function exportdailyflashsales(prm) {
    const datefrom = prm.datefrom
    const dateto = prm.dateto
    const from_store = prm.from_store
    const to_store = prm.to_store
    const stamp = prm.stamp
    const screen_id = prm.screen_id

    const username = 'admin'
    const client_ip = '192.168.151.68'

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ datefrom, dateto, from_store, to_store, stamp, screen_id })
        body: JSON.stringify({ username, client_ip })
    };

    // return fetch(`${PathBackEnd}/api/report/exportdailyflashsales`, requestOptions)
    return fetch(`http://192.168.151.31/trusted`, requestOptions)
        .then(response => {
            console.log(1)
            console.log(response)
            return handleResponse(response)
        })
        .then(user => {      
            console.log(2)
            console.log(user)     
            // login successful if there's a jwt token in the response
            if (user  && user.status == 'Y') {                        
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