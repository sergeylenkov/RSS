import { Entry, Feed } from '../../data';
import { State } from './index';

const feedsDict: { [key: string]: Feed } = {};

export function updateFeeds(state: State, feeds: Feed[]): State {
  feeds.forEach((feed: Feed) => {
    feedsDict[feed.id] = feed;

    const iconId = `icon_${feed.id}`;

    feed.icon = localStorage.getItem(iconId) || feed.iconUrl;

    if (!localStorage.getItem(iconId)) {
      toDataURL(feed.iconUrl).then(data => {
        localStorage.setItem(iconId, data);
      });    
    }
  });

  return {
    ...state,
    isUpdating: false,
    isInitialized: true,
    feeds: [...feeds],
  };
}

export function updateFeed(state: State, id: number, newFeed: Feed): State {
  const feeds = state.feeds.map((feed: Feed) => {
    return feed.id === id ? { ...feed, ...newFeed } : feed;
  });

  return {
    ...state,
    feeds: feeds,
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

  return {
    ...state,
    feeds: feeds,
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
  const feeds = [...state.feeds];
  let totalCount = 0;

  feeds.forEach((feed: Feed) => {
    const count = state.entries.filter((entry: Entry) => {
      return entry.feedId === feed.id && !entry.isViewed;
    }).length;

    feed.count = count;
    totalCount = totalCount + count;
  });

  return {
    ...state,
    feeds: feeds,
    unviewedCount: totalCount,
  };
}

export function updateViewed(state: State, ids: number[]): State {
  let entries = state.entries.map((entry: Entry) => {
    if (ids.indexOf(entry.id) !== -1) {
      return { ...entry, isViewed: true };
    }

    return entry;
  });

  entries = filterEntries(state.selectedFeeds, entries);

  return {
    ...state,
    entries: entries,
  };
}

export function updateFavorite(
  state: State,
  id: number,
  isFavorite: boolean
): State {
  let entries = state.entries.map((entry: Entry) => {
    return entry.id === id ? { ...entry, isFavorite: isFavorite } : entry;
  });

  entries = filterEntries(state.selectedFeeds, entries);

  return {
    ...state,
    entries: entries,
  };
}

export function updateRead(state: State, id: number, isRead: boolean): State {
  let entries = state.entries.map((entry: Entry) => {
    return entry.id === id ? { ...entry, isRead: isRead } : entry;
  });

  entries = filterEntries(state.selectedFeeds, entries);

  return {
    ...state,
    entries: entries,
  };
}

export function updateEntries(state: State, entries: Entry[]): State {
  updateFeedsInEntries(entries);

  const filteredEntries = filterEntries(state.selectedFeeds, entries);

  return {
    ...state,
    isUpdating: false,
    entriesCount: entries.length,
    entries: [...filteredEntries],
    allEntries: [...entries],
  };
}

export function updateEntriesCount(state: State): State {
  const feeds = [...state.feeds];

  feeds.forEach((feed: Feed) => {
    feed.count = state.entries.filter((entry: Entry) => {
      return entry.feedId === feed.id;
    }).length;
  });

  return {
    ...state,
    feeds: feeds,
  };
}

function filterEntries(selectedFeeds: number[], allEntries: Entry[]): Entry[] {
  let entries: Entry[] = [];

  if (selectedFeeds.length > 0) {
    entries = allEntries.filter((entry: Entry) => {
      return selectedFeeds.includes(entry.feedId);
    });
  } else {
    entries = allEntries;
  }

  return entries;
}

function getFeedById(id: number): Feed {
  return feedsDict[id];
}

function updateFeedsInEntries(entries: Entry[]): void {
  entries.forEach((entry) => {
    entry.feed = getFeedById(entry.feedId);
  });
}

function toDataURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader()

      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    });
  });  
}