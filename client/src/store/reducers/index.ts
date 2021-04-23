import { ActionTypes } from '../constants';
import { Feed, Entry } from '../../data';
import { Actions } from '../actions';

export interface State {
  isInitialized: boolean,
  isUpdating: boolean,
  isFeedsEditing: boolean,
  isUpdateError: boolean,
  isDarkTheme: boolean,
  isCollapseLong: boolean,
  keepDays: number,
  isGrid: boolean,
  entriesCount: number,
  unviewedCount: number,
  feeds: Feed[],
  allEntries: Entry[],
  entries: Entry[],
  selectedFeeds: number[]
}

export const initialState: State = {
  isInitialized: false,
  isUpdating: false,
  isFeedsEditing: false,
  isUpdateError: false,
  isDarkTheme: localStorage.getItem('darkTheme') ? JSON.parse(<string>localStorage.getItem('darkTheme')) : false,
  isCollapseLong: localStorage.getItem('collapseLong') ? JSON.parse(<string>localStorage.getItem('collapseLong')) : true,
  keepDays: localStorage.getItem('keepDays') ? parseInt(<string>localStorage.getItem('keepDays')) : 30,
  isGrid: localStorage.getItem('grid') ? JSON.parse(<string>localStorage.getItem('grid')) : false,
  entriesCount: 0,
  unviewedCount: 0,
  feeds: [],
  allEntries: [],
  entries: [],
  selectedFeeds: []
};

const feedsDict: { [key: string]: Feed } = {};

function rootReducer(state: State | undefined, action: Actions): State {
  if (!state) {
    return {...initialState};
  }

  if (action.type === ActionTypes.FEEDS_UPDATED) {
    action.feeds.forEach((feed: Feed) => {
      feedsDict[feed.id] = feed;
    });

    return {
      ...state,
      isUpdating: false,
      isInitialized: true,
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
    const feeds = state.feeds.map((feed: Feed) => {
      return feed.id === action.id ? { ...feed, ...action.feed } : feed
    });

    return {
      ...state,
      feeds: feeds
    }
  }

  if (action.type === ActionTypes.FEEDS_DELETE) {
    const feeds = state.feeds.filter((feed: Feed) => {
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
      isUpdating: action.isUpdating,
      isUpdateError: false
    }
  }

  if (action.type === ActionTypes.ENTRIES_LOADED) {
    updateFeedsInEntries(action.entries);

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

    feeds.forEach((feed: Feed) => {
      const count = state.entries.filter((entry: Entry) => {
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
    let entries = state.entries.map((entry: Entry) => {
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
    let entries = state.entries.map((entry: Entry) => {
      return entry.id === action.id ? { ...entry, isFavorite: action.isFavorite } : entry
    });

    entries = filterEntries(state.selectedFeeds, entries);

    return {
      ...state,
      entries: entries
    }
  }

  if (action.type === ActionTypes.UPDATE_READ) {
    let entries = state.entries.map((entry: Entry) => {
      return entry.id === action.id ? { ...entry, isRead: action.isRead } : entry
    });

    entries = filterEntries(state.selectedFeeds, entries);

    return {
      ...state,
      entries: entries
    }
  }

  if (action.type === ActionTypes.UPDATE_ENTRIES_COUNT) {
    const feeds = [...state.feeds];

    feeds.forEach((feed: Feed) => {
      feed.count = state.entries.filter((entry: Entry) => {
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
    localStorage.setItem('darkTheme', String(action.isDarkTheme));

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
    localStorage.setItem('collapseLong', String(action.isCollapse));

    return {
      ...state,
      isCollapseLong: action.isCollapse
    }
  }

  if (action.type === ActionTypes.UPDATE_KEEP_DAYS) {
    localStorage.setItem('keepDays', String(action.days));

    return {
      ...state,
      keepDays: action.days
    }
  }

  if (action.type === ActionTypes.TOGGLE_GRID) {
    localStorage.setItem('grid', String(action.isGrid));

    return {
      ...state,
      isGrid: action.isGrid
    }
  }

  return state;
}

function filterEntries(selectedFeeds: number[], allEntries: Entry[]): Entry[] {
  let entries: Entry[] = [];

  if (selectedFeeds.length > 0) {
    entries = allEntries.filter((entry: Entry) => {
      return selectedFeeds.includes(entry.feedId)
    });
  } else {
    entries = allEntries;
  }

  return entries;
}

function getFeedById(id: number): Feed {
  return feedsDict[id];
}

function updateFeedsInEntries(entries: Entry[]): void {
  entries.forEach(entry => {
    entry.feed = getFeedById(entry.feedId);
  });
}

export default rootReducer;
