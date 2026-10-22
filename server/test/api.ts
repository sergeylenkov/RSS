import assert from 'assert';

// Imported first on purpose: it redirects the app to a throwaway database
// before `db.ts` opens the connection. Module imports are hoisted, so this
// side effect cannot live inline in this file.
import './setup';

import request from 'supertest';
import Parser from 'rss-parser';
import db, { run as runStatement, all as allRows, EntryRow } from '../db';
import app from '../index';

const QUIET_FEED_URL = 'https://quiet.example/rss';

// The feed is seeded with a `last_update` of 1970, so every item below is
// "newer" than the last synchronisation would suggest.
const DATE_AFTER_UPDATE = '2010-01-01T00:00:00.000Z';

const FEED_ITEMS = [
  {
    guid: 'g1',
    link: 'https://quiet.example/1',
    title: 'Interesting',
    content: 'Old but interesting',
    isoDate: '2001-01-01T00:00:00.000Z',
  },
  {
    guid: 'g2',
    link: 'https://quiet.example/2',
    title: 'Boring',
    content: 'Old and boring',
    isoDate: '2001-01-02T00:00:00.000Z',
  },
];

interface AddEntryOverrides {
  feedId?: number;
  guid?: string;
  link?: string;
  title?: string;
  description?: string;
  read?: number;
  viewed?: number;
  favorite?: number;
  date?: string;
}

function run(sql: string, params: unknown[] = []) {
  return runStatement(sql, params);
}

function all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return allRows<T>(sql, params);
}

async function addEntry(overrides: AddEntryOverrides = {}) {
  const entry = {
    feedId: 1,
    guid: `guid-${Math.random()}`,
    link: 'https://example.com',
    title: 'Entry',
    description: 'Description',
    read: 0,
    viewed: 0,
    favorite: 0,
    date: new Date().toISOString(),
    ...overrides,
  };

  return run(
    'INSERT INTO entries (feed_id, guid, link, title, description, read, viewed, favorite, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      entry.feedId,
      entry.guid,
      entry.link,
      entry.title,
      entry.description,
      entry.read,
      entry.viewed,
      entry.favorite,
      entry.date,
    ]
  );
}

/**
 * Replaces the network fetch of the RSS parser with the given items for a
 * single test, restoring the original afterwards.
 */
async function withFeed(
  feedBody: Record<string, unknown>,
  action: () => Promise<void>
): Promise<void> {
  const original = Parser.prototype.parseURL;

  // `rss-parser` supports two styles: with a callback it returns `undefined`,
  // without one it returns a promise (see `utils.maybePromisify`). The models
  // await the promise form, so the test double has to return one — passing the
  // callback through to `original` would fall through to a real HTTP request
  // and fail with ENOTFOUND.
  Parser.prototype.parseURL = function parseURL(
    this: Parser,
    url: string,
    callback?: (err: Error | null, feed: never) => void
  ) {
    if (url !== QUIET_FEED_URL) {
      return original.call(this, url, callback as never);
    }

    if (callback) {
      callback(null, feedBody as never);

      return undefined as never;
    }

    return Promise.resolve(feedBody as never) as never;
  } as typeof Parser.prototype.parseURL;

  try {
    await action();
  } finally {
    Parser.prototype.parseURL = original;
  }
}

before(async () => {
  await run(
    'CREATE TABLE IF NOT EXISTS feeds (id INTEGER PRIMARY KEY AUTOINCREMENT, rss TEXT UNIQUE, link TEXT, title TEXT, description TEXT, image TEXT, active INTEGER, status INTEGER, last_update TEXT, deleted INTEGER)'
  );
  await run(
    'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, feed_id INTEGER, guid TEXT, link TEXT, title TEXT, description TEXT, read INTEGER, viewed INTEGER, favorite INTEGER, date TEXT)'
  );
  await run(
    'INSERT INTO feeds (rss, link, title, description, image, active, status, last_update, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      QUIET_FEED_URL,
      'https://quiet.example',
      'Quiet',
      '',
      '',
      1,
      0,
      new Date(0).toISOString(),
      0,
    ]
  );
});

after(() => {
  db.close();
});

describe('GET /feeds', () => {
  it('returns the stored feeds', async () => {
    const res = await request(app).get('/feeds').expect(200);

    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].title, 'Quiet');
  });
});

describe('GET /entries', () => {
  it('returns entries sorted by date', async () => {
    await run('DELETE FROM entries');
    await addEntry({ date: '2001-01-01T00:00:00.000Z' });
    await addEntry({ date: '2002-01-01T00:00:00.000Z' });

    const res = await request(app).get('/entries').expect(200);

    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].date, '2002-01-01T00:00:00.000Z');
  });
});

describe('GET /entries/unviewed', () => {
  it('returns only unviewed entries', async () => {
    const res = await request(app).get('/entries/unviewed').expect(200);

    assert(res.body.length > 0);
    assert(
      res.body.every((entry: { isViewed: boolean }) => entry.isViewed === false)
    );
  });
});

describe('POST /entries/view', () => {
  it('marks entries as viewed', async () => {
    await run('DELETE FROM entries');
    const insert = await addEntry({ title: 'to view' });

    await request(app)
      .post('/entries/view')
      .send({ ids: [insert.lastID] })
      .expect(200);

    const rows = await all<{ viewed: number }>(
      'SELECT viewed FROM entries WHERE id = ?',
      [insert.lastID]
    );

    assert.strictEqual(rows[0]?.viewed, 1);
  });

  it('ignores payloads that try to inject SQL', async () => {
    await run('DELETE FROM entries');
    const insert = await addEntry({ title: 'target' });

    await request(app)
      .post('/entries/view')
      .send({ ids: [`${insert.lastID}); DROP TABLE entries; --`] })
      .expect(200);

    const tables = await all(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'entries'"
    );
    const rows = await all<{ viewed: number }>(
      'SELECT viewed FROM entries WHERE id = ?',
      [insert.lastID]
    );

    assert.strictEqual(tables.length, 1, 'entries table must survive');
    assert.strictEqual(rows[0]?.viewed, 0, 'non-numeric id must be skipped');
  });
});

describe('PUT /entries/:id/favorite', () => {
  it('sets and unsets the favorite flag', async () => {
    await run('DELETE FROM entries');
    const insert = await addEntry({ title: 'favorite' });
    const id = insert.lastID;

    const res = await request(app).put(`/entries/${id}/favorite`).expect(200);
    const del = await request(app).delete(`/entries/${id}/favorite`).expect(200);

    assert.strictEqual(res.body.id, id);
    assert.strictEqual(res.body.isFavorite, true);
    assert.strictEqual(del.body.isFavorite, false);
  });
});

describe('PUT /entries/:id/read', () => {
  it('toggles the read flag', async () => {
    await run('DELETE FROM entries');
    const insert = await addEntry({ title: 'readable' });
    const id = insert.lastID;

    await request(app).put(`/entries/${id}/read`).expect(200);
    await request(app).delete(`/entries/${id}/read`).expect(200);

    const rows = await all<{ read: number }>(
      'SELECT read FROM entries WHERE id = ?',
      [id]
    );

    assert.strictEqual(rows[0]?.read, 0);
  });
});

describe('GET /entries/clear/:days', () => {
  beforeEach(async () => {
    await run('DELETE FROM entries');

    const old = '2001-01-01T00:00:00.000Z';

    await addEntry({ title: 'old', date: old });
    await addEntry({ title: 'old read', date: old, read: 1 });
    await addEntry({ title: 'old favorite', date: old, favorite: 1 });
    await addEntry({ title: 'fresh' });
  });

  it('removes old entries but keeps favorites', async () => {
    const res = await request(app).get('/entries/clear/30').expect(200);

    assert.strictEqual(res.body.days, 30);

    const titles = (await all<{ title: string }>('SELECT title FROM entries'))
      .map((row) => row.title)
      .sort();

    // Read status must not protect an entry from the cleanup.
    assert.deepStrictEqual(titles, ['fresh', 'old favorite']);
  });

  it('rejects a non-numeric amount of days', async () => {
    await request(app).get('/entries/clear/abc').expect(500);
  });
});

describe('GET /feeds/update', () => {
  it('imports entries from the feed', async () => {
    await withFeed({ title: 'Quiet', items: FEED_ITEMS }, async () => {
      const res = await request(app).get('/feeds/update').expect(200);

      assert.strictEqual(res.body.length, FEED_ITEMS.length);

      const titles = (await all<EntryRow>('SELECT title FROM entries')).map(
        (row) => row.title
      );

      assert(titles.includes('Interesting'));
      assert(titles.includes('Boring'));
    });
  });

  it('does not slip back into the old wrong filter', async () => {
    // Regression: `newEntry.date >= feed.lastUpdate` used to hide every item
    // published before the previous synchronisation. Here the feed is marked
    // as synchronised *now*, while the items are from 2001, so under the old
    // comparison nothing would be stored.
    await run('DELETE FROM entries');
    await run('UPDATE feeds SET last_update = ? WHERE rss = ?', [
      new Date().toISOString(),
      QUIET_FEED_URL,
    ]);

    const rows = await all<{ last_update: string }>(
      'SELECT last_update FROM feeds WHERE rss = ?',
      [QUIET_FEED_URL]
    );

    assert.strictEqual(rows.length, 1);
    assert(
      new Date(rows[0]!.last_update).getTime() >
        new Date(FEED_ITEMS[0]!.isoDate).getTime(),
      'precondition: the feed looks newer than the items it publishes'
    );

    await withFeed({ title: 'Quiet', items: FEED_ITEMS }, async () => {
      const res = await request(app).get('/feeds/update').expect(200);

      assert.strictEqual(res.body.length, FEED_ITEMS.length);
    });
  });

  it('picks up items added after the previous update', async () => {
    // The second synchronisation must not lose new items either: `last_update`
    // is already in the past, but the guid lookup is what decides whether an
    // item is new.
    await run('DELETE FROM entries');

    const fresh = {
      guid: 'g3',
      link: 'https://quiet.example/3',
      title: 'Fresh',
      content: 'Just published',
      isoDate: new Date(DATE_AFTER_UPDATE).toISOString(),
    };

    await withFeed({ title: 'Quiet', items: [fresh] }, async () => {
      await request(app).get('/feeds/update').expect(200);

      const titles = (await all<EntryRow>('SELECT title FROM entries')).map(
        (row) => row.title
      );

      assert.deepStrictEqual(titles, ['Fresh']);
    });
  });

  it('does not create duplicates on a repeated update', async () => {
    await withFeed({ title: 'Quiet', items: FEED_ITEMS }, async () => {
      await request(app).get('/feeds/update').expect(200);
      await request(app).get('/feeds/update').expect(200);

      const rows = await all<{ guid: string; total: number }>(
        'SELECT guid, COUNT(*) as total FROM entries GROUP BY guid'
      );

      rows.forEach((row) => {
        assert.strictEqual(row.total, 1, `guid ${row.guid} must be unique`);
      });
    });
  });

  it('keeps the user flags of an already known entry', async () => {
    await run('DELETE FROM entries');

    await withFeed({ title: 'Quiet', items: FEED_ITEMS }, async () => {
      await request(app).get('/feeds/update').expect(200);
    });

    const stored = await all<{ id: number }>(
      'SELECT id, read, viewed, favorite, title FROM entries WHERE guid = ?',
      ['g1']
    );

    const id = stored[0]!.id;

    await run('UPDATE entries SET read = 1, favorite = 1 WHERE id = ?', [id]);

    // The title in the feed changes, so the row is updated on the next sync.
    await withFeed(
      { title: 'Quiet', items: [{ ...FEED_ITEMS[0], title: 'Renamed' }] },
      async () => {
        await request(app).get('/feeds/update').expect(200);
      }
    );

    const rows = await all<{ title: string; read: number; favorite: number }>(
      'SELECT title, read, favorite FROM entries WHERE id = ?',
      [id]
    );

    assert.strictEqual(rows[0]?.title, 'Renamed');
    assert.strictEqual(rows[0]?.read, 1, 'read flag must survive the sync');
    assert.strictEqual(rows[0]?.favorite, 1, 'favorite flag must survive the sync');
  });

  it('survives a feed without an image', async () => {
    // `rss.image.url` used to throw on such feeds during the update.
    await withFeed(
      {
        title: 'No image',
        image: undefined,
        items: [{ ...FEED_ITEMS[0], guid: 'no-image' }],
      },
      async () => {
        await request(app).get('/feeds/update').expect(200);
      }
    );

    const rows = await all<{ image: string }>(
      'SELECT image FROM feeds WHERE rss = ?',
      [QUIET_FEED_URL]
    );

    assert.strictEqual(rows[0]?.image, '', 'missing image becomes empty');
  });
});
