import { ActionTypes } from '../constants';
import { Feed, Entry } from '../../data';
import { Actions } from '../actions/type';
import { isSystemDarkTheme } from '../../utils';
import { addFeed, removeFeed, selectFeed, updateEntries, updateEntriesCount, updateFavorite, updateFeed, updateFeeds, updateRead, updateUnviewedCount, updateViewed } from './utils';

export interface State {
  isInitialized: boolean;
  isUpdating: boolean;
  isFeedsEditing: boolean;
  isUpdateError: boolean;
  isDarkTheme: boolean;
  isCollapseLong: boolean;
  keepDays: number;
  isGrid: boolean;
  entriesCount: number;
  unviewedCount: number;
  feeds: Feed[];
  allEntries: Entry[];
  entries: Entry[];
  selectedFeeds: number[];
}

export const initialState: State = {
  isInitialized: false,
  isUpdating: false,
  isFeedsEditing: false,
  isUpdateError: false,
  isDarkTheme: localStorage.getItem('darkTheme')
    ? JSON.parse(<string>localStorage.getItem('darkTheme'))
    : isSystemDarkTheme(),
  isCollapseLong: localStorage.getItem('collapseLong')
    ? JSON.parse(<string>localStorage.getItem('collapseLong'))
    : true,
  keepDays: localStorage.getItem('keepDays')
    ? parseInt(<string>localStorage.getItem('keepDays'))
    : 30,
  isGrid: localStorage.getItem('grid')
    ? JSON.parse(<string>localStorage.getItem('grid'))
    : false,
  entriesCount: 0,
  unviewedCount: 0,
  feeds: [],
  allEntries: [],
  entries: [],
  selectedFeeds: [],
};

function rootReducer(state: State | undefined, action: Actions): State {
  if (!state) {
    return { ...initialState };
  }

  switch (action.type) {
    case ActionTypes.FEEDS_UPDATED:
      return updateFeeds(state, action.feeds);

    case ActionTypes.FEEDS_ADD:
      return addFeed(state, action.feed);

    case ActionTypes.FEEDS_UPDATE:
      return updateFeed(state, action.id, action.feed);

    case ActionTypes.FEEDS_DELETE:
      return removeFeed(state, action.id)

    case ActionTypes.FEEDS_SELECT:
      return selectFeed(state, action.id);

    case ActionTypes.UPDATE_UNVIEWED_COUNT:
      return updateUnviewedCount(state);

    case ActionTypes.UPDATE_VIEWED:
      return updateViewed(state, action.ids);

    case ActionTypes.UPDATE_FAVORITE:
      return updateFavorite(state, action.id, action.isFavorite);

    case ActionTypes.UPDATE_READ:
      return updateRead(state, action.id, action.isRead)

    case ActionTypes.UPDATE_ENTRIES_COUNT:
      return updateEntriesCount(state);

    case ActionTypes.ENTRIES_LOADED:
      return updateEntries(state, action.entries)

    default:
      break;
  }

  if (action.type === ActionTypes.FEEDS_EDITING) {
    return {
      ...state,
      isFeedsEditing: action.isEditing,
    };
  }

  if (action.type === ActionTypes.ENTRIES_UPDATING) {
    return {
      ...state,
      isUpdating: action.isUpdating,
      isUpdateError: false,
    };
  }

  if (action.type === ActionTypes.TOGGLE_THEME) {
    localStorage.setItem('darkTheme', String(action.isDarkTheme));

    return {
      ...state,
      isDarkTheme: action.isDarkTheme,
    };
  }

  if (action.type === ActionTypes.ENTRIES_UPDATE_ERROR) {
    return {
      ...state,
      isUpdating: false,
      isUpdateError: true,
    };
  }

  if (action.type === ActionTypes.TOGGLE_COLLAPSE_LONG) {
    localStorage.setItem('collapseLong', String(action.isCollapse));

    return {
      ...state,
      isCollapseLong: action.isCollapse,
    };
  }

  if (action.type === ActionTypes.UPDATE_KEEP_DAYS) {
    localStorage.setItem('keepDays', String(action.days));

    return {
      ...state,
      keepDays: action.days,
    };
  }

  if (action.type === ActionTypes.TOGGLE_GRID) {
    localStorage.setItem('grid', String(action.isGrid));

    return {
      ...state,
      isGrid: action.isGrid,
    };
  }

  return state;
}

export default rootReducer;
