import { FEEDS_UPDATING, FEEDS_UPDATED } from '../constants/index';

const initialState = {
    isUpdating: false,
    entries: []
};

function rootReducer(state = initialState, action) {
    if (action.type === FEEDS_UPDATING) {
        return Object.assign({}, state, {
            isUpdating: true
        });
    }

    if (action.type === FEEDS_UPDATED) {
        return Object.assign({}, state, {
            isUpdating: false,
            entries: state.entries.concat(action.payload)
        });
    }

    return state;
};

export default rootReducer;