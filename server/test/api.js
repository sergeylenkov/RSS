const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

// The database is chosen before anything requires `settings`, so the tests
// never touch the working database of the running app.
process.env.RSS_DB = path.join(
  fs.mkdtempSync(path.join(os.tmpdir(), "rss-test-")),
  "test.sqlite"
);
process.env.RSS_PORT = "0";

const request = require("supertest");
const Parser = require("rss-parser");
const db = require("../db");
const app = require("../index");

const QUIET_FEED_URL = "https://quiet.example/rss";

const FEED_ITEMS = [
  {
    guid: "g1",
    link: "https://quiet.example/1",
    title: "Interesting",
    content: "Old but interesting",
    isoDate: "2001-01-01T00:00:00.000Z",
  },
  {
    guid: "g2",
    link: "https://quiet.example/2",
    title: "Boring",
    content: "Old and boring",
    isoDate: "2001-01-02T00:00:00.000Z",
  },
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onDone(error) {
      return error ? reject(error) : resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => (error ? reject(error) : resolve(rows)));
  });
}

function addEntry(overrides = {}) {
  const entry = {
    feedId: 1,
    guid: `guid-${Math.random()}`,
    link: "https://example.com",
    title: "Entry",
    description: "Description",
    read: 0,
    viewed: 0,
    favorite: 0,
    date: new Date().toISOString(),
    ...overrides,
  };

  return run(
    "INSERT INTO entries (feed_id, guid, link, title, description, read, viewed, favorite, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

before(function () {
  return run(
    "CREATE TABLE IF NOT EXISTS feeds (id INTEGER PRIMARY KEY AUTOINCREMENT, rss TEXT UNIQUE, link TEXT, title TEXT, description TEXT, image TEXT, active INTEGER, status INTEGER, last_update TEXT, deleted INTEGER)"
  )
    .then(() =>
      run(
        "CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, feed_id INTEGER, guid TEXT, link TEXT, title TEXT, description TEXT, read INTEGER, viewed INTEGER, favorite INTEGER, date TEXT)"
      )
    )
    .then(() =>
      run(
        "INSERT INTO feeds (rss, link, title, description, image, active, status, last_update, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [QUIET_FEED_URL, "https://quiet.example", "Quiet", "", "", 1, 0, new Date(0).toISOString(), 0]
      )
    );
});

after(function () {
  db.close();
});

describe("GET /feeds", function () {
  it("returns the stored feeds", async function () {
    const res = await request(app).get("/feeds").expect(200);

    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].title, "Quiet");
  });
});

describe("GET /entries", function () {
  it("returns entries sorted by date", async function () {
    await run("DELETE FROM entries");
    await addEntry({ date: "2001-01-01T00:00:00.000Z" });
    await addEntry({ date: "2002-01-01T00:00:00.000Z" });

    const res = await request(app).get("/entries").expect(200);

    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].date, "2002-01-01T00:00:00.000Z");
  });
});

describe("GET /entries/unviewed", function () {
  it("returns only unviewed entries", async function () {
    const res = await request(app).get("/entries/unviewed").expect(200);

    assert(res.body.length > 0);
    assert(res.body.every((entry) => entry.isViewed === false));
  });
});

describe("POST /entries/view", function () {
  it("marks entries as viewed", async function () {
    await run("DELETE FROM entries");
    const insert = await addEntry({ title: "to view" });

    await request(app)
      .post("/entries/view")
      .send({ ids: [insert.lastID] })
      .expect(200);

    const rows = await all("SELECT viewed FROM entries WHERE id = ?", [
      insert.lastID,
    ]);

    assert.strictEqual(rows[0].viewed, 1);
  });

  it("ignores payloads that try to inject SQL", async function () {
    await run("DELETE FROM entries");
    const insert = await addEntry({ title: "target" });

    await request(app)
      .post("/entries/view")
      .send({ ids: [`${insert.lastID}); DROP TABLE entries; --`] })
      .expect(200);

    const tables = await all(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'entries'"
    );
    const rows = await all("SELECT viewed FROM entries WHERE id = ?", [
      insert.lastID,
    ]);

    assert.strictEqual(tables.length, 1, "entries table must survive");
    assert.strictEqual(rows[0].viewed, 0, "non-numeric id must be skipped");
  });
});

describe("PUT /entries/:id/favorite", function () {
  it("sets and unsets the favorite flag", async function () {
    await run("DELETE FROM entries");
    const insert = await addEntry({ title: "favorite" });
    const id = insert.lastID;

    const res = await request(app).put(`/entries/${id}/favorite`).expect(200);
    const del = await request(app).delete(`/entries/${id}/favorite`).expect(200);

    assert.strictEqual(res.body.id, id);
    assert.strictEqual(res.body.isFavorite, true);
    assert.strictEqual(del.body.isFavorite, false);
  });
});

describe("PUT /entries/:id/read", function () {
  it("toggles the read flag", async function () {
    await run("DELETE FROM entries");
    const insert = await addEntry({ title: "readable" });
    const id = insert.lastID;

    await request(app).put(`/entries/${id}/read`).expect(200);
    await request(app).delete(`/entries/${id}/read`).expect(200);

    const rows = await all("SELECT read FROM entries WHERE id = ?", [id]);

    assert.strictEqual(rows[0].read, 0);
  });
});

describe("GET /entries/clear/:days", function () {
  beforeEach(async function () {
    await run("DELETE FROM entries");

    const old = "2001-01-01T00:00:00.000Z";

    await addEntry({ title: "old", date: old });
    await addEntry({ title: "old read", date: old, read: 1 });
    await addEntry({ title: "old favorite", date: old, favorite: 1 });
    await addEntry({ title: "fresh" });
  });

  it("removes old entries but keeps favorites", async function () {
    const res = await request(app).get("/entries/clear/30").expect(200);

    assert.strictEqual(res.body.days, 30);

    const titles = (await all("SELECT title FROM entries"))
      .map((row) => row.title)
      .sort();

    // Read status must not protect an entry from the cleanup.
    assert.deepStrictEqual(titles, ["fresh", "old favorite"]);
  });

  it("rejects a non-numeric amount of days", function () {
    return request(app).get("/entries/clear/abc").expect(500);
  });
});

describe("GET /feeds/update", function () {
  it("imports entries from the feed", async function () {
    const original = Parser.prototype.parseURL;

    Parser.prototype.parseURL = function parseURL(url, callback) {
      if (url === QUIET_FEED_URL) {
        return callback(null, { title: "Quiet", items: FEED_ITEMS });
      }

      return original.call(this, url, callback);
    };

    try {
      const res = await request(app).get("/feeds/update").expect(200);

      assert.strictEqual(res.body.length, FEED_ITEMS.length);

      const titles = (await all("SELECT title FROM entries")).map(
        (row) => row.title
      );

      assert(titles.includes("Interesting"));
      assert(titles.includes("Boring"));
    } finally {
      Parser.prototype.parseURL = original;
    }
  });
});
