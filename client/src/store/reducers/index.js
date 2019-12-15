import {
    FEEDS_UPDATING, FEEDS_UPDATED, FEEDS_ADD, FEEDS_DELETE,
    ENTRIES_UPDATING, ENTRIES_UPDATED, UPDATE_UNVIEWED_COUNT, UPDATE_VIEWED
} from '../constants/index';

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

    if (action.type === FEEDS_ADD) {
        const feeds = [...state.feeds];

        feeds.push(action.feed);

        return Object.assign({}, state, {
            feeds: feeds
        });
    }

    if (action.type === FEEDS_DELETE) {
        const feeds = state.feeds.filter(feed => {
            return feed.id !== action.id
        });        

        return Object.assign({}, state, {
            feeds: feeds
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

    if (action.type === UPDATE_UNVIEWED_COUNT) {
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

    if (action.type === UPDATE_VIEWED) {
        const entries = [...state.entries];

        state.entries.forEach(entry => {
            if (action.ids.indexOf(entry.id) !== -1) {
                entry.isViewed = true;
            }
        });

        return Object.assign({}, state, {           
            entries: entries
        });
    }

    return state;
};

export default rootReducer;