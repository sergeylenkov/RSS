import {
    FEEDS_UPDATING, FEEDS_UPDATED, FEEDS_ADD, FEEDS_DELETE,
    ENTRIES_UPDATING, ENTRIES_UPDATED, UPDATE_UNVIEWED_COUNT, UPDATE_VIEWED
} from '../constants/index';

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

export function entriesUpdating() {
    return { type: ENTRIES_UPDATING }
}

export function entriesUpdated(entries) {
    return { type: ENTRIES_UPDATED, entries }
}

export function updateUnviewedCount() {
    return { type: UPDATE_UNVIEWED_COUNT }
}

export function updateViewed(ids) {
    return { type: UPDATE_VIEWED, ids }
}