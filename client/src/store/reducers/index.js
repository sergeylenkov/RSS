import {
    FEEDS_UPDATING, FEEDS_UPDATED, FEEDS_ADD, FEEDS_DELETE,
    ENTRIES_UPDATING, ENTRIES_UPDATED, UPDATE_UNVIEWED_COUNT, UPDATE_VIEWED,
    UPDATE_FAVORITE, UPDATE_READ
} from '../constants/index';

const initialState = {
    isUpdating: false,
    unviewedCount: 0,
    feeds: [],
    entries: []
};

function rootReducer(state = initialState, action) {
    if (action.type === FEEDS_UPDATING) {
        return {
            ...state,
            isUpdating: true
        }
    }

    if (action.type === FEEDS_UPDATED) {
        return {
            ...state,
            isUpdating: false,
            feeds: [...action.feeds]
        }
    }

    if (action.type === FEEDS_ADD) {
        const feeds = [...state.feeds];

        feeds.push(action.feed);

        return {
            ...state,
            feeds: feeds
        }
    }

    if (action.type === FEEDS_DELETE) {
        const feeds = state.feeds.filter(feed => {
            return feed.id !== action.id
        });        

        return {
            ...state,
            feeds: feeds
        }
    }

    if (action.type === ENTRIES_UPDATING) {
        return {
            ...state,
            isUpdating: true
        }
    }

    if (action.type === ENTRIES_UPDATED) {
        return {
            ...state,
            isUpdating: false,
            entries: [...action.entries]
        }
    }

    if (action.type === UPDATE_UNVIEWED_COUNT) {
        const feeds = [...state.feeds];
        let totalCount = 0;

        feeds.forEach(feed => {
            const count = state.entries.filter(entry => {
                return entry.feedId === feed.id && entry.isViewed !== true
            }).length;

            feed.count = count;
            totalCount = totalCount + count;
        });
        
        return {
            ...state,
            feeds: feeds,
            unviewedCount: totalCount
        }
    }

    if (action.type === UPDATE_VIEWED) {
        const entries = state.entries.map(entry => {
            if (action.ids.indexOf(entry.id) !== -1) {                
                return { ...entry, isViewed: true }
            }

            return entry;
        });

        return {
            ...state,
            entries: entries
        }
    }

    if (action.type === UPDATE_FAVORITE) {
        const entries = state.entries.map(entry => {
            return entry.id === action.id ? { ...entry, isFavorite: action.isFavorite } : entry
        });

        return {
            ...state,
            entries: entries
        }
    }

    if (action.type === UPDATE_READ) {
        const entries = state.entries.map(entry => {
            return entry.id === action.id ? { ...entry, isRead: true } : entry
        });

        return {
            ...state,
            entries: entries
        }
    }

    return state;
};

export default rootReducer;