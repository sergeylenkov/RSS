import Parser from 'rss-parser';
import { all, get, run, ExistingEntryRow, FeedRow } from '../db';
import { log } from '../utils';
import {
  DeleteResult,
  Entry,
  Feed,
  FeedPatch,
  ParsedEntry,
  PatchResult,
} from '../types/models';

const SELECT_FEEDS = `SELECT f.*, COUNT(e.id) as total
  FROM feeds f
  LEFT JOIN entries e ON e.feed_id = f.id
  WHERE f.deleted = 0
  GROUP BY f.id`;

function convertRowFeed(row: FeedRow): Feed {
  return {
    id: row.id,
    rss: row.rss,
    link: row.link,
    title: row.title,
    description: row.description,
    image: row.image,
    active: Boolean(row.active),
    status: row.status,
    lastUpdate: new Date(row.last_update),
    deleted: Boolean(row.deleted),
    total: row.total ?? 0,
    count: 0,
  };
}

async function getFeeds(): Promise<Feed[]> {
  const rows = await all<FeedRow>(SELECT_FEEDS);

  return rows.map(convertRowFeed);
}

async function getFeed(id: number | string): Promise<Feed> {
  const row = await get<FeedRow>('SELECT f.* FROM feeds f WHERE f.id = ?', [id]);

  if (!row) {
    throw { message: 'Feed not found' };
  }

  return convertRowFeed(row);
}

export async function getAll(): Promise<Feed[]> {
  const items = await getFeeds();

  log('Get all feeds', items);

  return items;
}

export async function update(): Promise<Entry[]> {
  const data = await getFeeds();
  const rss = data.filter((item) => item.deleted === false);

  let items: Entry[] = [];

  const promises = rss.map(async (feed) => {
    try {
      const entries = await updateFeed(feed);
      items = items.concat(entries);
    } catch (error) {
      log('Update feed error: ', error);
    }
  });

  await Promise.all(promises);

  return items;
}

export function add(feed: string): Promise<Feed> {
  return addFeed(feed);
}

export async function patch(id: number | string, data: FeedPatch): Promise<PatchResult> {
  const feed = await getFeed(id);

  if (data.title) {
    feed.title = data.title;
  }

  await run(
    'UPDATE feeds SET rss = ?, link = ?, title = ?, description = ?, image = ? WHERE id = ?',
    [feed.rss, feed.link, feed.title, feed.description, feed.image, id]
  );

  return { id: feed.id, data: feed };
}

export async function remove(id: string): Promise<DeleteResult> {
  await run('DELETE FROM feeds WHERE id = ?', [id]);
  await run('DELETE FROM entries WHERE feed_id = ?', [id]);

  return { id: Number(id), isDeleted: true };
}

async function addFeed(link: string): Promise<Feed> {
  const existing = await get<{ id: number }>('SELECT id FROM feeds WHERE rss = ?', [
    link,
  ]);

  if (existing) {
    throw { message: 'Feed already exists' };
  }

  const parser = new Parser();
  const rss = await parser.parseURL(link);

  const feed: Feed = {
    id: -1,
    rss: link,
    title: rss.title ?? '',
    description: rss.description ?? '',
    link: rss.link ?? '',
    // `rss.image` is undefined for feeds without a logo.
    image: rss.image?.url ?? '',
    count: 0,
    total: 0,
    active: true,
    status: 0,
    lastUpdate: new Date(),
    deleted: false,
  };

  const result = await run(
    'INSERT INTO feeds (rss, link, title, description, image, active, status, last_update, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      feed.rss,
      feed.link,
      feed.title,
      feed.description,
      feed.image,
      true,
      0,
      feed.lastUpdate.toISOString(),
      false,
    ]
  );

  // `lastID` comes from the statement metadata rather than from `this`, which
  // is what the callback-based version relied on.
  feed.id = result.lastID;

  return feed;
}

async function updateFeed(feed: Feed): Promise<Entry[]> {
  const parser = new Parser();

  log('Update feed', feed.rss);

  const rss = await parser.parseURL(feed.rss).catch((error: Error) => {
    log('Update feed error', error);
    throw error;
  });

  const date = new Date();

  // Most feeds carry no image, so `rss.image` must not be dereferenced
  // unconditionally.
  const image = rss.image?.url;

  if (image) {
    await run('UPDATE feeds SET last_update = ?, image = ? WHERE id = ?', [
      date.toISOString(),
      image,
      feed.id,
    ]);
  } else {
    await run('UPDATE feeds SET last_update = ? WHERE id = ?', [
      date.toISOString(),
      feed.id,
    ]);
  }

  const items: Entry[] = [];

  const promises = (rss.items ?? []).map(async (rawEntry) => {
    const newEntry = prepareEntry(feed, rawEntry);

    // `addEntry` looks an entry up by (feed_id, guid): unknown items are
    // inserted, known ones are refreshed in place. No comparison against
    // `feed.lastUpdate` is needed — and the one that used to be here was
    // false anyway, because the two values are built differently:
    // `feed.lastUpdate` is a Date parsed from a second-precision UTC string,
    // while `newEntry.date` keeps milliseconds, so any entry that also had
    // milliseconds was "older" than the previous synchronisation and got
    // skipped forever. Once synchronised, a feed could never receive a single
    // new item.
    if (!newEntry.guid) {
      log('Skip entry without guid and link', newEntry);
      return;
    }

    const entry = await addEntry(newEntry);
    items.push(entry);
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    log('Update feed entries error', error);
    throw error;
  }

  return items;
}

function prepareEntry(
  feed: Feed,
  entry: Parser.Item
): ParsedEntry {
  return {
    id: -1,
    feedId: feed.id,
    guid: entry.guid ?? entry.link ?? '',
    link: entry.link ?? '',
    title: entry.title ?? '',
    description: entry.content ?? '',
    date: toDate(entry.isoDate ?? entry.pubDate),
    isRead: false,
    isViewed: false,
    isFavorite: false,
  };
}

/** Parses a feed date, falling back to "now" when it is missing or broken. */
function toDate(value: string | undefined): Date {
  const date = value ? new Date(value) : new Date();

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function addEntry(entry: ParsedEntry): Promise<Entry> {
  const date = entry.date.toISOString();

  const row = await get<ExistingEntryRow>(
    'SELECT id, read, viewed, favorite FROM entries WHERE feed_id = ? AND guid = ?',
    [entry.feedId, entry.guid]
  );

  if (row) {
    // The entry is already known: refresh the fields that come from the feed
    // and keep the user flags (read / viewed / favorite) as they are.
    await run('UPDATE entries SET link = ?, title = ?, description = ?, date = ? WHERE id = ?', [
      entry.link,
      entry.title,
      entry.description,
      date,
      row.id,
    ]);

    return {
      id: row.id,
      feedId: entry.feedId,
      guid: entry.guid,
      link: entry.link,
      title: entry.title,
      description: entry.description,
      date,
      isRead: Boolean(row.read),
      isViewed: Boolean(row.viewed),
      isFavorite: Boolean(row.favorite),
    };
  }

  const result = await run(
    'INSERT INTO entries (feed_id, guid, link, title, description, read, viewed, favorite, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      entry.feedId,
      entry.guid,
      entry.link,
      entry.title,
      entry.description,
      false,
      false,
      false,
      date,
    ]
  );

  return {
    id: result.lastID,
    feedId: entry.feedId,
    guid: entry.guid,
    link: entry.link,
    title: entry.title,
    description: entry.description,
    date,
    isRead: false,
    isViewed: false,
    isFavorite: false,
  };
}
