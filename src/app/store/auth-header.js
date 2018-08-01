import { localStorageAuth } from '../../../settings'

export function authHeader() {
    // return authorization header with jwt token  
    let user = JSON.parse(localStorage.getItem(localStorageAuth));  

    if (user && user.token) {
        return { 'authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}