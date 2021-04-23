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

export function feedsUpdated(feeds: Feed[]): FeedsUpdatedAction {
  return { type: ActionTypes.FEEDS_UPDATED, feeds };
}

export function feedsAdd(feed: Feed): FeedsAddAction {
  return { type: ActionTypes.FEEDS_ADD, feed }
}

export function feedsDelete(id: number): FeedsDeleteAction {
  return { type: ActionTypes.FEEDS_DELETE, id }
}

export function feedsEditing(isEditing: boolean): FeedsEditingAction {
  return { type: ActionTypes.FEEDS_EDITING, isEditing }
}

export function feedsSelect(id: number): FeedsSelectAction {
  return { type: ActionTypes.FEEDS_SELECT, id }
}

export function feedsUpdate(id: number, feed: Feed): FeedsUpdateAction {
  return { type: ActionTypes.FEEDS_UPDATE, id, feed }
}

export function entriesUpdating(isUpdating: boolean): EntriesUpdatingAction {
  return { type: ActionTypes.ENTRIES_UPDATING, isUpdating }
}

export function entriesUpdated(entries: Entry[]): EntriesLoadedAction {
  return { type: ActionTypes.ENTRIES_LOADED, entries }
}

export function updateUnviewedCount(): UpdateUnviewedCountAction {
  return { type: ActionTypes.UPDATE_UNVIEWED_COUNT }
}

export function updateViewed(ids: number[]): UpdateViewedAction {
  return { type: ActionTypes.UPDATE_VIEWED, ids }
}

export function updateFavorite(id: number, isFavorite: boolean): UpdateFavoriteAction {
  return { type: ActionTypes.UPDATE_FAVORITE, id, isFavorite }
}

export function updateRead(id: number, isRead: boolean): UpdateReadAction {
  return { type: ActionTypes.UPDATE_READ, id, isRead }
}

export function updateEntriesCount(): UpdateEntriesCountAction {
  return { type: ActionTypes.UPDATE_ENTRIES_COUNT }
}

export function entriesUpdateError(): EntriesUpdateErrorAction {
  return { type: ActionTypes.ENTRIES_UPDATE_ERROR }
}

export function toggleTheme(isDarkTheme: boolean): ToggleThemeAction {
  return { type: ActionTypes.TOGGLE_THEME, isDarkTheme }
}

export function toggleCollapseLong(isCollapse: boolean): ToggleCollapseLongAction {
  return { type: ActionTypes.TOGGLE_COLLAPSE_LONG, isCollapse }
}

export function updateKeepDays(days: number): UpdateKeepDaysAction {
  return { type: ActionTypes.UPDATE_KEEP_DAYS, days };
}

export function toggleGrid(isGrid: boolean): ToggleGridAction {
  return { type: ActionTypes.TOGGLE_GRID, isGrid };
}
