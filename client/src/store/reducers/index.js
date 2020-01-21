import {
    FEEDS_UPDATING, FEEDS_UPDATED, FEEDS_ADD, FEEDS_DELETE, FEEDS_UPDATE,
    ENTRIES_UPDATING, ENTRIES_LOADED, UPDATE_UNVIEWED_COUNT, UPDATE_VIEWED,
    UPDATE_FAVORITE, UPDATE_READ, CHANGE_VIEW_MODE, UPDATE_ENTRIES_COUNT,
    FEEDS_EDITING, FEEDS_SELECT, TOGGLE_THEME
} from '../constants/index.js';

const initialState = {
    isUpdating: false,
    isFeedsEditing: false,
    isDarkTheme: localStorage.getItem('darkTheme'),
    entriesCount: 0,
    unviewedCount: 0,
    viewMode: 0,
    feeds: [],
    allEntries: [],
    entries: [],
    selectedFeeds: []
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

    if (action.type === FEEDS_UPDATE) {
        const feeds = state.feeds.map(feed => {
            return feed.id === action.id ? { ...feed, ...action.data } : feed
        });

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

    if (action.type === FEEDS_EDITING) {
        return {
            ...state,
            isFeedsEditing: action.isEditing
        }
    }

    if (action.type === ENTRIES_UPDATING) {
        return {
            ...state,
            isUpdating: true
        }
    }

    if (action.type === ENTRIES_LOADED) {
        const entries = filterEntries(state.selectedFeeds, action.entries);

        return {
            ...state,
            isUpdating: false,
            entriesCount: action.entries.length,
            entries: [...entries],
            allEntries: [...action.entries]
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
        let entries = state.entries.map(entry => {
            if (action.ids.indexOf(entry.id) !== -1) {
                return { ...entry, isViewed: true }
            }

            return entry;
        });

        entries = filterEntries(state.selectedFeeds, entries);

        return {
            ...state,
            entries: entries
        }
    }

    if (action.type === UPDATE_FAVORITE) {
        let entries = state.entries.map(entry => {
            return entry.id === action.id ? { ...entry, isFavorite: action.isFavorite } : entry
        });

        entries = filterEntries(state.selectedFeeds, entries);

        return {
            ...state,
            entries: entries
        }
    }

    if (action.type === UPDATE_READ) {
        let entries = state.entries.map(entry => {
            return entry.id === action.id ? { ...entry, isRead: true } : entry
        });

        entries = filterEntries(state.selectedFeeds, entries);

        return {
            ...state,
            entries: entries
        }
    }

    if (action.type === CHANGE_VIEW_MODE) {
        return {
            ...state,
            viewMode: action.mode
        }
    }

    if (action.type === UPDATE_ENTRIES_COUNT) {
        const feeds = [...state.feeds];

        feeds.forEach(feed => {
            const count = state.entries.filter(entry => {
                return entry.feedId === feed.id
            }).length;

            feed.count = count;
        });

        return {
            ...state,
            feeds: feeds
        }
    }

    if (action.type === FEEDS_SELECT) {
        const selectedFeeds = [...state.selectedFeeds];

        const index = selectedFeeds.indexOf(action.id);

        if (index === -1) {
            selectedFeeds.push(action.id);
        } else {
            selectedFeeds.splice(index, 1);
        }

        const entries = filterEntries(selectedFeeds, state.allEntries);

        return {
            ...state,
            selectedFeeds: selectedFeeds,
            entries: [...entries]
        }
    }

    if (action.type === TOGGLE_THEME) {
        localStorage.setItem('darkTheme', action.isDarkTheme);

        return {
            ...state,
            isDarkTheme: action.isDarkTheme
        }
    }
    return state;
};

function filterEntries(selectedFeeds, allEntries) {
    let entries = [];

    if (selectedFeeds.length > 0) {
        entries = allEntries.filter(entry => {
            return selectedFeeds.includes(entry.feedId)
        });
    } else {
        entries = allEntries;
    }

    return entries;
}

export default rootReducer;