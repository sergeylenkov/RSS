import { Entry, Feed } from '../../data';
import { ActionTypes } from '../constants';
import { EntriesLoadedAction, EntriesUpdateErrorAction, EntriesUpdatingAction, FeedsAddAction, FeedsDeleteAction, FeedsEditingAction, FeedsSelectAction, FeedsUpdateAction, FeedsUpdatedAction, ToggleCollapseLongAction, ToggleGridAction, ToggleThemeAction, UpdateEntriesCountAction, UpdateFavoriteAction, UpdateKeepDaysAction, UpdateReadAction, UpdateUnviewedCountAction, UpdateViewedAction } from './type';

export function feedsUpdated(feeds: Feed[]): FeedsUpdatedAction   {
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
