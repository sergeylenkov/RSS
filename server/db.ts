import sqlite3 from 'sqlite3';
import settings from './settings';

/**
 * Raw shapes of the SQLite tables, as they come back from the driver.
 *
 * SQLite has no boolean type: the read / viewed / favorite / deleted /
 * active flags are stored as integers and converted at the model boundary.
 */
export interface FeedRow {
  id: number;
  rss: string;
  link: string;
  title: string;
  description: string;
  image: string;
  active: number;
  status: number;
  last_update: string;
  deleted: number;
  /** Present on queries that join the entries table. */
  total?: number;
}

export interface EntryRow {
  id: number;
  feed_id: number;
  guid: string;
  link: string;
  title: string;
  description: string;
  read: number;
  viewed: number;
  favorite: number;
  date: string;
}

/** The subset of `entries` needed to decide whether an entry already exists. */
export interface ExistingEntryRow {
  id: number;
  read: number;
  viewed: number;
  favorite: number;
}

const db = new sqlite3.Database(settings.db);

export default db;

/**
 * Promise wrappers around the callback-based driver.
 *
 * `run` resolves with the statement metadata (`lastID`, `changes`), which is
 * only available through `this` in a regular callback — an arrow function
 * would lose it.
 */
export function run(sql: string, params: unknown[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onDone(this: sqlite3.RunResult, error: Error | null) {
      if (error) {
        reject(error);
        return;
      }

      resolve(this);
    });
  });
}

export function all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all<T>(sql, params, (error: Error | null, rows: T[]) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

export function get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get<T>(sql, params, (error: Error | null, row: T) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}
