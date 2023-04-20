import { config } from '../constants';

export interface SetReadResponse {
  id: number;
  isRead: boolean;
}

export interface SetFavoriteResponse {
  id: number;
  isFavorite: boolean;
}

export interface SetViewedResponse {
  ids: number[];
  isViewed: boolean;
}

export interface ClearEntriesResponse {
  days: number;
}

export interface UpdateFeedResponse {
  id: number;
  feed: Feed;
}

export interface DeleteFeedResponse {
  id: number;
  isDeleted: boolean;
}

export interface Feed {
  id: number;
  title: string;
  link: string;
  image: string;
  iconUrl: string;
  icon: string;
  count: number;
}

export interface Entry {
  id: number;
  feedId: number;
  feed: Feed;
  title: string;
  description: string;
  link: string;
  isViewed: boolean;
  isFavorite: boolean;
  isRead: boolean;
}

export async function update() {
  const response = await fetch(`${config.urls.api}feeds/update`);
  return response.json();
}

export async function getFeeds(): Promise<Feed[]> {
  const response = await fetch(`${config.urls.api}feeds`);
  const feeds = await response.json();

  feeds.forEach((feed: Feed) => {
    const a = document.createElement('a');
    a.href = feed.link;

    if (feed.image && feed.image.length > 0) {
      feed.iconUrl = feed.image;
    } else {
      feed.iconUrl = `${a.protocol}//${a.hostname}/favicon.ico`;
    }
  });

  return feeds;
}

export async function clearEntries(
  days: number
): Promise<ClearEntriesResponse> {
  const response = await fetch(`${config.urls.api}entries/clear/${days}`);
  return response.json();
}

export async function setViewed(ids: number[]): Promise<SetViewedResponse> {
  const response = await fetch(`${config.urls.api}entries/view`, {
    method: 'POST',
    body: JSON.stringify({ ids: ids }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

export async function setRead(id: number, isRead: boolean) {
  const method = isRead ? 'PUT' : 'DELETE';

  const response = await fetch(`${config.urls.api}entries/${id}/read`, {
    method: method,
  });

  return response.json();
}

export async function setFavorite(id: number, isFavorite: boolean) {
  const method = isFavorite ? 'PUT' : 'DELETE';

  const response = fetch(`${config.urls.api}entries/${id}/favorite`, {
    method: method,
  });

  return (await response).json();
}

export async function allEntries(): Promise<Entry[]> {
  const response = await fetch(`${config.urls.api}entries`);
  return response.json();
}

export async function readEntries(): Promise<Entry[]> {
  const response = await fetch(`${config.urls.api}entries/read`);
  return response.json();
}

export async function getFavorites(): Promise<Entry[]> {
  const response = await fetch(`${config.urls.api}entries/favorites`);
  return response.json();
}

export async function getUnviewed(): Promise<Entry[]> {
  const response = await fetch(`${config.urls.api}entries/unviewed`);
  return response.json();
}

export async function addFeed(link: string): Promise<Feed> {
  const response = await fetch(`${config.urls.api}feeds`, {
    method: 'POST',
    body: JSON.stringify({ link: link }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

export async function updateFeed(feed: Feed): Promise<UpdateFeedResponse> {
  const response = await fetch(`${config.urls.api}feeds/${feed.id}`, {
    method: 'PATCH',
    body: JSON.stringify(feed),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

export async function deleteFeed(id: number): Promise<DeleteFeedResponse> {
  const response = await fetch(`${config.urls.api}feeds/${id}`, {
    method: 'DELETE',
  });

  return response.json();
}
