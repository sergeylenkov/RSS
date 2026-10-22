import { all, run, EntryRow } from '../db';
import {
  ClearResult,
  Entry,
  FavoriteResult,
  ReadResult,
  ViewedResult,
} from '../types/models';

const DEFAULT_LIMIT = 30;

function convertRowEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    feedId: row.feed_id,
    guid: row.guid,
    link: row.link,
    title: row.title,
    description: row.description,
    isRead: Boolean(row.read),
    isViewed: Boolean(row.viewed),
    isFavorite: Boolean(row.favorite),
    date: row.date,
  };
}

function selectEntries(sql: string, params: unknown[] = []): Promise<Entry[]> {
  return all<EntryRow>(sql, params).then((rows) => rows.map(convertRowEntry));
}

export function getAll(): Promise<Entry[]> {
  return selectEntries('SELECT * FROM entries ORDER BY date DESC LIMIT ?', [
    DEFAULT_LIMIT,
  ]);
}

export function unviewed(): Promise<Entry[]> {
  return selectEntries('SELECT * FROM entries WHERE viewed = ? ORDER BY date DESC', [
    false,
  ]);
}

export function favorites(): Promise<Entry[]> {
  return selectEntries(
    'SELECT * FROM entries WHERE favorite = ? ORDER BY date DESC',
    [true]
  );
}

export function read(): Promise<Entry[]> {
  return selectEntries('SELECT * FROM entries WHERE read = ? ORDER BY date DESC', [
    true,
  ]);
}

export async function setViewed(ids: unknown): Promise<ViewedResult> {
  // Only numeric ids are accepted: the list is interpolated as placeholders,
  // never as raw SQL, so a malformed payload cannot inject a query.
  const values = (Array.isArray(ids) ? ids : [])
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id));

  if (values.length === 0) {
    return { ids: [], isViewed: true };
  }

  const placeholders = values.map(() => '?').join(',');

  await run(`UPDATE entries SET viewed = ? WHERE id IN(${placeholders})`, [
    true,
    ...values,
  ]);

  return { ids: values, isViewed: true };
}

export async function setRead(id: unknown, isRead: boolean): Promise<ReadResult> {
  const entryId = Number(id);

  await run('UPDATE entries SET read = ? WHERE id = ?', [isRead, entryId]);

  return { id: entryId, isRead };
}

export async function setFavorite(
  id: unknown,
  isFavorite: boolean
): Promise<FavoriteResult> {
  const entryId = Number(id);

  await run('UPDATE entries SET favorite = ? WHERE id = ?', [isFavorite, entryId]);

  return { id: entryId, isFavorite };
}

export async function clear(days: unknown): Promise<ClearResult> {
  const keep = Number(days);

  if (!Number.isInteger(keep) || keep < 0) {
    // Rejected as a plain object, which the route turns into a 500 — the same
    // contract the JavaScript version had.
    throw { message: 'Days must be a non-negative integer' };
  }

  const date = new Date();
  date.setDate(date.getDate() - keep);

  // Old entries are removed unless the user marked them as favorite.
  const result = await run('DELETE FROM entries WHERE date < ? AND favorite = ?', [
    date.toISOString(),
    false,
  ]);

  const removed = result.changes ?? 0;

  try {
    await run('VACUUM');
  } catch (error) {
    // Cleanup is best effort: entries are already gone.
    void error;
  }

  return { days: keep, removed };
}
