import { authHeader } from '../../store';
import { localStorageAuth, PathBackEnd } from '../../../../settings'
import 'isomorphic-fetch'

export const sdcbatchfileService = {
    rerunbatchsdcinterface,
}

async function rerunbatchsdcinterface(prm) {
    const file_type = prm.file_type
    const year = prm.year
    const month = prm.month
    const day = prm.day
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_type, year, month, day, screen_id }),
        timeout: 0,
    };

    return await fetch(`${PathBackEnd}/api/sdcbatchfile/rerunsdcinterface`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
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