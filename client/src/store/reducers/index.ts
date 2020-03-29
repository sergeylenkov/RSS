import { ActionTypes } from '../constants';

interface State {
  isUpdating: boolean,
  isFeedsEditing: boolean,
  isUpdateError: boolean,
  isDarkTheme: boolean,
  isCollapseLong: boolean,
  keepDays: number,
  entriesCount: number,
  unviewedCount: number,
  viewMode: number,
  feeds: any[],
  allEntries: any[],
  entries: any[],
  selectedFeeds: any[]
}

const initialState: State = {
  isUpdating: false,
  isFeedsEditing: false,
  isUpdateError: false,
  isDarkTheme: localStorage.getItem('darkTheme') ? JSON.parse(<string>localStorage.getItem('darkTheme')) : false,
  isCollapseLong: localStorage.getItem('collapseLong') ? JSON.parse(<string>localStorage.getItem('collapseLong')) : true,
  keepDays: localStorage.getItem('keepDays') ? parseInt(<string>localStorage.getItem('keepDays')) : 30,
  entriesCount: 0,
  unviewedCount: 0,
  viewMode: 0,
  feeds: [],
  allEntries: [],
  entries: [],
  selectedFeeds: []
};

function rootReducer(state = initialState, action: any) {
  if (action.type === ActionTypes.FEEDS_UPDATING) {
    return {
      ...state,
      isUpdating: true
    }
  }

  if (action.type === ActionTypes.FEEDS_UPDATED) {
    return {
      ...state,
      isUpdating: false,
      feeds: [...action.feeds]
    }
  }

  if (action.type === ActionTypes.FEEDS_ADD) {
    const feeds = [...state.feeds];

    feeds.push(action.feed);

    return {
      ...state,
      feeds: feeds
    }
  }

  if (action.type === ActionTypes.FEEDS_UPDATE) {
    const feeds = state.feeds.map((feed: any) => {
      return feed.id === action.id ? { ...feed, ...action.data } : feed
    });

    return {
      ...state,
      feeds: feeds
    }
  }

  if (action.type === ActionTypes.FEEDS_DELETE) {
    const feeds = state.feeds.filter((feed: any) => {
      return feed.id !== action.id
    });

    return {
      ...state,
      feeds: feeds
    }
  }

  if (action.type === ActionTypes.FEEDS_EDITING) {
    return {
      ...state,
      isFeedsEditing: action.isEditing
    }
  }

  if (action.type === ActionTypes.ENTRIES_UPDATING) {
    return {
      ...state,
      isUpdating: true,
      isUpdateError: false,
    }
  }

  if (action.type === ActionTypes.ENTRIES_LOADED) {
    const entries = filterEntries(state.selectedFeeds, action.entries);

    return {
      ...state,
      isUpdating: false,
      entriesCount: action.entries.length,
      entries: [...entries],
      allEntries: [...action.entries]
    }
  }

  if (action.type === ActionTypes.UPDATE_UNVIEWED_COUNT) {
    const feeds = [...state.feeds];
    let totalCount = 0;

    feeds.forEach((feed: any) => {
      const count = state.entries.filter((entry: any) => {
        return entry.feedId === feed.id && !entry.isViewed
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

  if (action.type === ActionTypes.UPDATE_VIEWED) {
    let entries = state.entries.map((entry: any) => {
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

  if (action.type === ActionTypes.UPDATE_FAVORITE) {
    let entries = state.entries.map((entry: any) => {
      return entry.id === action.id ? { ...entry, isFavorite: action.isFavorite } : entry
    });

    entries = filterEntries(state.selectedFeeds, entries);

    return {
      ...state,
      entries: entries
    }
  }

  if (action.type === ActionTypes.UPDATE_READ) {
    let entries = state.entries.map((entry: any) => {
      return entry.id === action.id ? { ...entry, isRead: action.isRead } : entry
    });

    entries = filterEntries(state.selectedFeeds, entries);

    return {
      ...state,
      entries: entries
    }
  }

  if (action.type === ActionTypes.CHANGE_VIEW_MODE) {
    return {
      ...state,
      viewMode: action.mode
    }
  }

  if (action.type === ActionTypes.UPDATE_ENTRIES_COUNT) {
    const feeds = [...state.feeds];

    feeds.forEach((feed: any) => {
      feed.count = state.entries.filter((entry: any) => {
        return entry.feedId === feed.id
      }).length;
    });

    return {
      ...state,
      feeds: feeds
    }
  }

  if (action.type === ActionTypes.FEEDS_SELECT) {
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

  if (action.type === ActionTypes.TOGGLE_THEME) {
    localStorage.setItem('darkTheme', action.isDarkTheme);

    return {
      ...state,
      isDarkTheme: action.isDarkTheme
    }
  }

  if (action.type === ActionTypes.ENTRIES_UPDATE_ERROR) {
    return {
      ...state,
      isUpdating: false,
      isUpdateError: true
    }
  }

  if (action.type === ActionTypes.TOGGLE_COLLAPSE_LONG) {
    localStorage.setItem('collapseLong', action.isCollapse);

    return {
      ...state,
      isCollapseLong: action.isCollapse
    }
  }

  if (action.type === ActionTypes.UPDATE_KEEP_DAYS) {
    localStorage.setItem('keepDays', action.days);

    return {
      ...state,
      keepDays: action.days
    }
  }

  return state;
};

function filterEntries(selectedFeeds: number[], allEntries: any[]) {
  let entries = [];

  if (selectedFeeds.length > 0) {
    entries = allEntries.filter((entry: any) => {
      return selectedFeeds.includes(entry.feedId)
    });
  } else {
    entries = allEntries;
  }

  return entries;
}

export default rootReducer;
