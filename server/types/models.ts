/**
 * Domain types shared by the persistence layer, the models and the routes.
 *
 * These describe the shape returned by the API (camelCase, booleans) rather
 * than the raw SQLite rows, which are described separately in `db.ts`.
 */

export interface Feed {
  id: number;
  rss: string;
  link: string;
  title: string;
  description: string;
  image: string;
  active: boolean;
  status: number;
  lastUpdate: Date;
  deleted: boolean;
  /** Number of entries currently stored for the feed. */
  total: number;
  count: number;
}

export interface Entry {
  id: number;
  feedId: number;
  guid: string;
  link: string;
  title: string;
  description: string;
  isRead: boolean;
  isViewed: boolean;
  isFavorite: boolean;
  /** ISO 8601 string, as stored in the `date` column. */
  date: string;
}

/** An entry taken from a parsed RSS feed, before it is written to the DB. */
export interface ParsedEntry {
  id: number;
  feedId: number;
  guid: string;
  link: string;
  title: string;
  description: string;
  date: Date;
  isRead: boolean;
  isViewed: boolean;
  isFavorite: boolean;
}

export interface FeedPatch {
  title?: string;
}

export interface ViewedResult {
  ids: number[];
  isViewed: true;
}

export interface ReadResult {
  id: number;
  isRead: boolean;
}

export interface FavoriteResult {
  id: number;
  isFavorite: boolean;
}

export interface DeleteResult {
  id: number;
  isDeleted: true;
}

export interface PatchResult {
  id: number;
  data: Feed;
}

export interface ClearResult {
  days: number;
  removed: number;
}
