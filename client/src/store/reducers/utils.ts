import { Entry, Feed } from '../../data';
import { State } from './index';

/**
 * Attaches feeds to entries using the feeds stored in the state.
 * Entries whose feed is not known yet keep `feed` undefined and are resolved
 * later, when the feeds arrive (see `updateFeeds`), so the order of the two
 * requests no longer matters.
 */
function withFeeds(entries: Entry[], feeds: Feed[]): Entry[] {
  if (feeds.length === 0) {
    return entries;
  }

  const feedsById = new Map<number, Feed>();
  feeds.forEach((feed) => {
    feedsById.set(feed.id, feed);
  });

  return entries.map((entry) => {
    const feed = feedsById.get(entry.feedId);

    return entry.feed === feed ? entry : { ...entry, feed };
  });
}

export function updateFeeds(state: State, feeds: Feed[]): State {
  feeds.forEach((feed: Feed) => {
    const iconId = `icon_${feed.id}`;

    feed.icon = localStorage.getItem(iconId) || feed.iconUrl;

    if (!localStorage.getItem(iconId)) {
      toDataURL(feed.iconUrl).then((data) => {
        localStorage.setItem(iconId, data);
      });
    }
  });

  return {
    ...state,
    isUpdating: false,
    isInitialized: true,
    feeds: [...feeds],
    allEntries: withFeeds(state.allEntries, feeds),
    entries: withFeeds(state.entries, feeds),
  };
}

export function updateFeed(state: State, id: number, newFeed: Feed): State {
  const feeds = state.feeds.map((feed: Feed) => {
    return feed.id === id ? { ...feed, ...newFeed } : feed;
  });

  // Entries keep a copy of their feed, so it must be refreshed as well.
  const allEntries = state.allEntries.map((entry) => {
    return entry.feedId === id
      ? { ...entry, feed: { ...entry.feed, ...newFeed } }
      : entry;
  });

  return {
    ...state,
    feeds: feeds,
    allEntries: allEntries,
    entries: filterEntries(state.selectedFeeds, allEntries),
  };
}

export function addFeed(state: State, feed: Feed): State {
  const feeds = [...state.feeds];

  feeds.push(feed);

  return {
    ...state,
    feeds: feeds,
  };
}

export function removeFeed(state: State, id: number): State {
  const feeds = state.feeds.filter((feed: Feed) => {
    return feed.id !== id;
  });

  const selectedFeeds = state.selectedFeeds.filter((feedId) => feedId !== id);
  const allEntries = state.allEntries.filter((entry) => entry.feedId !== id);

  return {
    ...state,
    feeds: feeds,
    selectedFeeds: selectedFeeds,
    allEntries: allEntries,
    entries: filterEntries(selectedFeeds, allEntries),
    entriesCount: allEntries.length,
  };
}

export function selectFeed(state: State, id: number): State {
  const selectedFeeds = [...state.selectedFeeds];

  const index = selectedFeeds.indexOf(id);

  if (index === -1) {
    selectedFeeds.push(id);
  } else {
    selectedFeeds.splice(index, 1);
  }

  const entries = filterEntries(selectedFeeds, state.allEntries);

  return {
    ...state,
    selectedFeeds: selectedFeeds,
    entries: [...entries],
  };
}

export function updateUnviewedCount(state: State): State {
  let totalCount = 0;

  const feeds = state.feeds.map((feed: Feed) => {
    const count = state.entries.filter((entry: Entry) => {
      return entry.feedId === feed.id && !entry.isViewed;
    }).length;

    totalCount = totalCount + count;

    return feed.count === count ? feed : { ...feed, count };
  });

  return {
    ...state,
    feeds: feeds,
    unviewedCount: totalCount,
  };
}

export function updateViewed(state: State, ids: number[]): State {
  // `allEntries` is the source of truth: `entries` is only its filtered view.
  const allEntries = state.allEntries.map((entry: Entry) => {
    if (ids.indexOf(entry.id) !== -1) {
      return { ...entry, isViewed: true };
    }

    return entry;
  });

  return {
    ...state,
    allEntries: allEntries,
    entries: filterEntries(state.selectedFeeds, allEntries),
  };
}

export function updateFavorite(
  state: State,
  id: number,
  isFavorite: boolean
): State {
  const allEntries = state.allEntries.map((entry: Entry) => {
    return entry.id === id ? { ...entry, isFavorite: isFavorite } : entry;
  });

  return {
    ...state,
    allEntries: allEntries,
    entries: filterEntries(state.selectedFeeds, allEntries),
  };
}

export function updateRead(state: State, id: number, isRead: boolean): State {
  const allEntries = state.allEntries.map((entry: Entry) => {
    return entry.id === id ? { ...entry, isRead: isRead } : entry;
  });

  return {
    ...state,
    allEntries: allEntries,
    entries: filterEntries(state.selectedFeeds, allEntries),
  };
}

export function updateEntries(state: State, entries: Entry[]): State {
  const allEntries = withFeeds(entries, state.feeds);
  const filteredEntries = filterEntries(state.selectedFeeds, allEntries);
  const counts = countEntries(allEntries);

  return {
    ...state,
    isUpdating: false,
    entriesCount: allEntries.length,
    allEntriesCount: counts.all,
    readEntriesCount: counts.read,
    favoriteEntriesCount: counts.favorite,
    entries: [...filteredEntries],
    allEntries: [...allEntries],
  };
}

export function updateEntriesCount(state: State): State {
  const feeds = state.feeds.map((feed: Feed) => {
    const count = state.allEntries.filter((entry: Entry) => {
      return entry.feedId === feed.id;
    }).length;

    return feed.count === count ? feed : { ...feed, count };
  });

  return {
    ...state,
    feeds: feeds,
  };
}

function filterEntries(selectedFeeds: number[], allEntries: Entry[]): Entry[] {
  let entries: Entry[] = [];

  if (selectedFeeds.length > 0) {
    entries = allEntries.filter((entry) => {
      return selectedFeeds.includes(entry.feedId);
    });
  } else {
    entries = allEntries;
  }

  return entries;
}

/** Per-tab counters, computed from the full (unfiltered) entry list. */
function countEntries(entries: Entry[]): {
  all: number;
  read: number;
  favorite: number;
} {
  let read = 0;
  let favorite = 0;

  entries.forEach((entry) => {
    if (entry.isRead) read += 1;
    if (entry.isFavorite) favorite += 1;
  });

  return { all: entries.length, read, favorite };
}

function toDataURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
}
