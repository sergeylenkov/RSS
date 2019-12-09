import { FEEDS_UPDATING, FEEDS_UPDATED } from '../constants/index';

export function updateFeeds(payload) {
    return { type: FEEDS_UPDATING, payload }
}

export function feedsUpdated(payload) {
    return { type: FEEDS_UPDATED, payload }
}  