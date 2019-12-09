import { FEEDS_UPDATING, FEEDS_UPDATED, ENTRIES_UPDATING, ENTRIES_UPDATED, UPDATE_ENTRIES_COUNT } from '../constants/index';

const initialState = {
    isUpdating: false,
    feeds: [],
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
            feeds: [...action.feeds]
        });
    }

    if (action.type === ENTRIES_UPDATING) {
        return Object.assign({}, state, {
            isUpdating: true
        });
    }

    if (action.type === ENTRIES_UPDATED) {
        return Object.assign({}, state, {
            isUpdating: false,
            entries: [...action.entries]
        });
    }

    if (action.type === UPDATE_ENTRIES_COUNT) {
        const feeds = [...state.feeds];

        feeds.forEach(feed => {
            const count = state.entries.filter(entry => {
                return entry.feedId === feed.id && entry.isViewed !== true
            }).length;

            feed.count = count;
        });
        
        return Object.assign({}, state, {           
            feeds: feeds
        });
    }

    return state;
};

export default rootReducer;