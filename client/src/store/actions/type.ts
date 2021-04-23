import { Entry, Feed } from '../../data';
import { ActionTypes } from '../constants';

interface Action<Type> {
  type: Type;
}

interface FeedsUpdatedAction extends Action<ActionTypes.FEEDS_UPDATED> {
  feeds: Feed[];
}

interface FeedsAddAction extends Action<ActionTypes.FEEDS_ADD> {
  feed: Feed;
}

interface FeedsDeleteAction extends Action<ActionTypes.FEEDS_DELETE> {
  id: number;
}

interface FeedsEditingAction extends Action<ActionTypes.FEEDS_EDITING> {
  isEditing: boolean;
}

interface FeedsSelectAction extends Action<ActionTypes.FEEDS_SELECT> {
  id: number;
}

interface FeedsUpdateAction extends Action<ActionTypes.FEEDS_UPDATE> {
  id: number;
  feed: Feed;
}

interface EntriesUpdatingAction extends Action<ActionTypes.ENTRIES_UPDATING> {
  isUpdating: boolean;
}

interface EntriesLoadedAction extends Action<ActionTypes.ENTRIES_LOADED> {
  entries: Entry[];
}

type UpdateUnviewedCountAction = Action<ActionTypes.UPDATE_UNVIEWED_COUNT>

interface UpdateViewedAction extends Action<ActionTypes.UPDATE_VIEWED> {
  ids: number[];
}

interface UpdateFavoriteAction extends Action<ActionTypes.UPDATE_FAVORITE> {
  id: number;
  isFavorite: boolean;
}

interface UpdateReadAction extends Action<ActionTypes.UPDATE_READ> {
  id: number;
  isRead: boolean;
}

type UpdateEntriesCountAction = Action<ActionTypes.UPDATE_ENTRIES_COUNT>;
type EntriesUpdateErrorAction = Action<ActionTypes.ENTRIES_UPDATE_ERROR>;

interface ToggleThemeAction extends Action<ActionTypes.TOGGLE_THEME> {
  isDarkTheme: boolean;
}

interface ToggleCollapseLongAction extends Action<ActionTypes.TOGGLE_COLLAPSE_LONG> {
  isCollapse: boolean;
}

interface UpdateKeepDaysAction extends Action<ActionTypes.UPDATE_KEEP_DAYS> {
  days: number;
}

interface ToggleGridAction extends Action<ActionTypes.TOGGLE_GRID> {
  isGrid: boolean;
}

export type Actions = FeedsUpdatedAction | FeedsAddAction | FeedsDeleteAction | FeedsEditingAction | FeedsSelectAction | FeedsUpdateAction
| EntriesUpdatingAction | EntriesLoadedAction | UpdateUnviewedCountAction | UpdateViewedAction | UpdateFavoriteAction | UpdateReadAction
| UpdateEntriesCountAction | EntriesUpdateErrorAction | ToggleThemeAction | ToggleCollapseLongAction | UpdateKeepDaysAction | ToggleGridAction;

export type {
  FeedsUpdatedAction,
  FeedsAddAction,
  FeedsDeleteAction,
  FeedsEditingAction,
  FeedsSelectAction,
  FeedsUpdateAction,
  EntriesUpdatingAction,
  EntriesLoadedAction,
  UpdateUnviewedCountAction,
  UpdateViewedAction,
  UpdateFavoriteAction,
  UpdateReadAction,
  UpdateEntriesCountAction,
  EntriesUpdateErrorAction,
  ToggleThemeAction,
  ToggleCollapseLongAction,
  UpdateKeepDaysAction,
  ToggleGridAction
}