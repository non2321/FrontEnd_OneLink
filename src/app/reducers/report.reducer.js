import { reportConstants } from '../constants'

export function reportreducers(state = { data: null }, action) {
    switch (action.type) {
        case reportConstants.EXPORT_SUCCESS:
            return {
                data: action.report,
            }
        default:
            return state
    }
}