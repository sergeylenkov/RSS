import { ActionTypes } from '../constants';
import { Feed, Entry } from '../../data';
import { Actions } from '../actions/type';
import { isSystemDarkTheme } from '../../utils';
import {
  addFeed,
  removeFeed,
  selectFeed,
  updateEntries,
  updateEntriesCount,
  updateFavorite,
  updateFeed,
  updateFeeds,
  updateRead,
  updateUnviewedCount,
  updateViewed,
} from './utils';

export interface State {
  isInitialized: boolean;
  isUpdating: boolean;
  isFeedsEditing: boolean;
  isUpdateError: boolean;
  isDarkTheme: boolean;
  isCollapseLong: boolean;
  keepDays: number;
  isGrid: boolean;
  /** Total number of loaded entries (all tabs). */
  entriesCount: number;
  /** Entries in the "Все" tab. */
  allEntriesCount: number;
  /** Entries in the "Прочитанное" tab. */
  readEntriesCount: number;
  /** Entries in the "Избранное" tab. */
  favoriteEntriesCount: number;
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
  allEntriesCount: 0,
  readEntriesCount: 0,
  favoriteEntriesCount: 0,
  unviewedCount: 0,
  feeds: [],
  allEntries: [],
  entries: [],
  selectedFeeds: [],
};

function rootReducer(
  // `configureStore` types the initial state as `Partial<State>`, so both
  // shapes are accepted. `createStore` used to pass a full `State` or
  // `undefined`. The caller is responsible for supplying a complete state.
  state: State | Partial<State> | undefined,
  action: Actions
): State {
  if (!state) {
    return { ...initialState };
  }

  const current = state as State;

  switch (action.type) {
    case ActionTypes.FEEDS_UPDATED:
      return updateFeeds(current, action.feeds);

    case ActionTypes.FEEDS_ADD:
      return addFeed(current, action.feed);

    case ActionTypes.FEEDS_UPDATE:
      return updateFeed(current, action.id, action.feed);

    case ActionTypes.FEEDS_DELETE:
      return removeFeed(current, action.id);

    case ActionTypes.FEEDS_SELECT:
      return selectFeed(current, action.id);

    case ActionTypes.UPDATE_UNVIEWED_COUNT:
      return updateUnviewedCount(current);

    case ActionTypes.UPDATE_VIEWED:
      return updateViewed(current, action.ids);

    case ActionTypes.UPDATE_FAVORITE:
      return updateFavorite(current, action.id, action.isFavorite);

    case ActionTypes.UPDATE_READ:
      return updateRead(current, action.id, action.isRead);

    case ActionTypes.UPDATE_ENTRIES_COUNT:
      return updateEntriesCount(current);

    case ActionTypes.ENTRIES_LOADED:
      return updateEntries(current, action.entries);

    default:
      break;
  }

  if (action.type === ActionTypes.FEEDS_EDITING) {
    return {
      ...current,
      isFeedsEditing: action.isEditing,
    };
  }

  if (action.type === ActionTypes.ENTRIES_UPDATING) {
    return {
      ...current,
      isUpdating: action.isUpdating,
      isUpdateError: false,
    };
  }

  if (action.type === ActionTypes.TOGGLE_THEME) {
    localStorage.setItem('darkTheme', String(action.isDarkTheme));

    return {
      ...current,
      isDarkTheme: action.isDarkTheme,
    };
  }

  if (action.type === ActionTypes.ENTRIES_UPDATE_ERROR) {
    return {
      ...current,
      isUpdating: false,
      isUpdateError: true,
    };
  }

  if (action.type === ActionTypes.TOGGLE_COLLAPSE_LONG) {
    localStorage.setItem('collapseLong', String(action.isCollapse));

    return {
      ...current,
      isCollapseLong: action.isCollapse,
    };
  }

  if (action.type === ActionTypes.UPDATE_KEEP_DAYS) {
    localStorage.setItem('keepDays', String(action.days));

    return {
      ...current,
      keepDays: action.days,
    };
  }

  if (action.type === ActionTypes.TOGGLE_GRID) {
    localStorage.setItem('grid', String(action.isGrid));

    return {
      ...current,
      isGrid: action.isGrid,
    };
  }

  return current;
}

export default rootReducer;
