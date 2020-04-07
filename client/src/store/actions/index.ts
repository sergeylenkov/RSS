import { ActionTypes } from '../constants';

export function feedsUpdated(feeds: any[]) {
  return { type: ActionTypes.FEEDS_UPDATED, feeds }
}

export function feedsAdd(feed: any) {
  return { type: ActionTypes.FEEDS_ADD, feed }
}

export function feedsDelete(id: number) {
  return { type: ActionTypes.FEEDS_DELETE, id }
}

export function feedsEditing(isEditing: boolean) {
  return { type: ActionTypes.FEEDS_EDITING, isEditing }
}

export function feedsSelect(id: number) {
  return { type: ActionTypes.FEEDS_SELECT, id }
}

export function entriesUpdating(isUpdating: boolean) {
  return { type: ActionTypes.ENTRIES_UPDATING, isUpdating: isUpdating }
}

export function entriesUpdated(entries: any[]) {
  return { type: ActionTypes.ENTRIES_LOADED, entries }
}

export function updateUnviewedCount() {
  return { type: ActionTypes.UPDATE_UNVIEWED_COUNT }
}

export function updateViewed(ids: number[]) {
  return { type: ActionTypes.UPDATE_VIEWED, ids }
}

export function updateFavorite(id: number, isFavorite: boolean) {
  return { type: ActionTypes.UPDATE_FAVORITE, id: id, isFavorite: isFavorite }
}

export function updateRead(id: number, isRead: boolean) {
  return { type: ActionTypes.UPDATE_READ, id: id, isRead: isRead }
}

export function changePath(path: string) {
  return { type: ActionTypes.CHANGE_PATH, mode: path }
}

export function updateEntriesCount() {
  return { type: ActionTypes.UPDATE_ENTRIES_COUNT }
}

export function feedsUpdate(id: number, data: any) {
  return { type: ActionTypes.FEEDS_UPDATE, id: id, data: data }
}

export function toggleTheme(isDarkTheme: boolean) {
  return { type: ActionTypes.TOGGLE_THEME, isDarkTheme: isDarkTheme }
}

export function entriesUpdateError() {
  return { type: ActionTypes.ENTRIES_UPDATE_ERROR }
}

export function toggleCollapseLong(isCollapse: boolean) {
  return { type: ActionTypes.TOGGLE_COLLAPSE_LONG, isCollapse: isCollapse }
}

export function updateKeepDays(days: number) {
  return { type: ActionTypes.UPDATE_KEEP_DAYS, days: days};
}
