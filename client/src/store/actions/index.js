import {
    FEEDS_UPDATING, FEEDS_UPDATED, FEEDS_ADD, FEEDS_DELETE, FEEDS_UPDATE,
    ENTRIES_UPDATING, ENTRIES_LOADED, UPDATE_UNVIEWED_COUNT, UPDATE_VIEWED,
    UPDATE_FAVORITE, UPDATE_READ, CHANGE_VIEW_MODE, UPDATE_ENTRIES_COUNT,
    FEEDS_EDITING, FEEDS_SELECT, TOGGLE_THEME
} from '../constants/index.js';

export function feedsUpdating() {
    return { type: FEEDS_UPDATING }
}

export function feedsUpdated(feeds) {
    return { type: FEEDS_UPDATED, feeds }
}

export function feedsAdd(feed) {
    return { type: FEEDS_ADD, feed }
}

export function feedsDelete(id) {
    return { type: FEEDS_DELETE, id }
}

export function feedsEditing(isEditing) {
    return { type: FEEDS_EDITING, isEditing }
}

export function feedsSelect(id) {
    return { type: FEEDS_SELECT, id }
}

export function entriesUpdating() {
    return { type: ENTRIES_UPDATING }
}

export function entriesUpdated(entries) {
    return { type: ENTRIES_LOADED, entries }
}

export function updateUnviewedCount() {
    return { type: UPDATE_UNVIEWED_COUNT }
}

export function updateViewed(ids) {
    return { type: UPDATE_VIEWED, ids }
}

export function updateFavorite(id, isFavorite) {
    return { type: UPDATE_FAVORITE, id: id, isFavorite: isFavorite }
}

export function updateRead(id, isRead) {
    return { type: UPDATE_READ, id: id, isRead: isRead }
}

export function changeViewMode(mode) {
    return { type: CHANGE_VIEW_MODE, mode: mode }
}

export function updateEntriesCount() {
    return { type: UPDATE_ENTRIES_COUNT }
}

export function feedsUpdate(id, data) {
    return { type: FEEDS_UPDATE, id: id, data: data }
}

export function toggleTheme(isDarkTheme) {
    return { type: TOGGLE_THEME, isDarkTheme: isDarkTheme }
}