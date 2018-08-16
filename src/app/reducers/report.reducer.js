import { reportConstants } from '../constants'

export function reportreducers(state = { data: null }, action) {
    switch (action.type) {
        case reportConstants.TOKEN_SUCCESS:       
            return {                
                data: action.token,
            }
        default:
            return state
    }
}