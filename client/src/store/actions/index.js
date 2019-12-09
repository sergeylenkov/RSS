import { FEEDS_UPDATING, FEEDS_UPDATED, ENTRIES_UPDATING, ENTRIES_UPDATED, UPDATE_ENTRIES_COUNT } from '../constants/index';

export function feedsUpdating() {
    return { type: FEEDS_UPDATING }
}

export function feedsUpdated(feeds) {
    return { type: FEEDS_UPDATED, feeds }
}

export function entriesUpdating() {
    return { type: ENTRIES_UPDATING }
}

export function entriesUpdated(entries) {
    return { type: ENTRIES_UPDATED, entries }
}

export function updateEntriesCount() {
    return { type: UPDATE_ENTRIES_COUNT }
}