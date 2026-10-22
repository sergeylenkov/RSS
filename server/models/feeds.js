const db = require("../db");
const Parser = require("rss-parser");
const utils = require("../utils");

module.exports.all = function () {
  return new Promise((resolve, reject) => {
    _getFeeds()
      .then((items) => {
        utils.log("Get all feeds", items);
        resolve(items);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.update = function () {
  return new Promise((resolve, reject) => {
    let items = [];

    _getFeeds().then((data) => {
      const rss = data.filter((item) => {
        return item.deleted == false;
      });

      let promises = [];

      rss.forEach((feed) => {
        const promise = _updateFeed(feed)
          .then((entries) => {
            items = items.concat(entries);
          })
          .catch((error) => {
            utils.log("Update feed error: ", error);
          });

        promises.push(promise);
      });

      Promise.all(promises)
        .then(() => {
          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

module.exports.add = function (feed) {
  return _addFeed(feed);
};

module.exports.patch = function (id, data) {
  return new Promise((resolve, reject) => {
    _getFeed(id)
      .then((feed) => {
        if (data.title) {
          feed.title = data.title;
        }

        db.run(
          `UPDATE feeds SET rss = ?, link = ?, title = ?, description = ?, image = ? WHERE id = ?`,
          [feed.rss, feed.link, feed.title, feed.description, feed.image, id],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve({ id: feed.id, data: feed });
            }
          }
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.delete = function (id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM feeds WHERE id = ?", [id], function (error) {
      if (error) {
        reject(error);
        return;
      }

      db.run("DELETE FROM entries WHERE feed_id = ?", [id], function (error) {
        if (error) {
          reject(error);
        } else {
          resolve({ id: id, isDeleted: true });
        }
      });
    });
  });
};

function _getFeeds() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT f.*, COUNT(e.id) as total FROM feeds f LEFT JOIN entries e ON e.feed_id = f.id WHERE f.deleted = 0 GROUP BY f.id",
      [],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        let items = [];

        rows.forEach((row) => {
          const item = _convertRowFeed(row);
          items.push(item);
        });

        resolve(items);
      }
    );
  });
}

function _getFeed(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT f.* FROM feeds f WHERE f.id = ?", [id], (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      if (row) {
        const item = _convertRowFeed(row);
        resolve(item);
      } else {
        reject({ message: "Feed not found" });
      }
    });
  });
}

function _addFeed(link) {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM feeds WHERE rss = ?", [link], function (error, row) {
      if (error) {
        reject(error);
        return;
      }

      if (row) {
        reject({ message: "Feed already exists" });
        return;
      }

      const parser = new Parser();

      parser.parseURL(link, (error, rss) => {
        if (error) {
          reject(error);
          return;
        }

        let feed = {
          id: -1,
          rss: link,
          title: rss.title,
          description: rss.description,
          link: rss.link,
          // `rss.image` is undefined for feeds without a logo.
          image: (rss.image && rss.image.url) || "",
          count: 0,
          lastUpdate: new Date(),
        };

        db.run(
          "INSERT INTO feeds (rss, link, title, description, image, active, status, last_update, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          ],
          function (error) {
            if (error) {
              reject(error);
              return;
            }

            // `this` is only available in a regular callback, not an arrow.
            feed.id = this.lastID;
            resolve(feed);
          }
        );
      });
    });
  });
}

function _updateFeed(feed) {
  return new Promise((resolve, reject) => {
    const parser = new Parser();
    utils.log("Update feed", feed.rss);
    parser.parseURL(feed.rss, (error, rss) => {
      if (error) {
        utils.log("Update feed error", error);
        reject(error);
        return;
      }

      const date = new Date();

      // Most feeds carry no image, so `rss.image` must not be dereferenced
      // unconditionally.
      const image = rss.image && rss.image.url;

      db.run(
        `UPDATE feeds SET last_update = ?${
          image ? ", image = ?" : ""
        } WHERE id = ?`,
        image
          ? [date.toISOString(), image, feed.id]
          : [date.toISOString(), feed.id],
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          let items = [];
          let promises = [];

          (rss.items || []).forEach((entry) => {
            const newEntry = _prepareEntry(feed, entry);

            // `_addEntry` looks an entry up by (feed_id, guid): unknown items
            // are inserted, known ones are refreshed in place. No comparison
            // against `feed.lastUpdate` is needed вЂ” and the one that used to
            // be here was false anyway, because the two values are built
            // differently: `feed.lastUpdate` is a Date parsed from a
            // second-precision UTC string, while `newEntry.date` keeps
            // milliseconds, so any entry that also had milliseconds was
            // "older" than the previous synchronisation and got skipped
            // forever. Once synchronised, a feed could never receive a single
            // new item.
            if (!newEntry.guid) {
              utils.log("Skip entry without guid and link", newEntry);
              return;
            }

            const promise = _addEntry(newEntry).then((entry) => {
              items.push(entry);
            });

            promises.push(promise);
          });

          Promise.all(promises)
            .then(() => {
              resolve(items);
            })
            .catch((error) => {
              utils.log("Update feed entries error", error);
              reject(error);
            });
        }
      );
    });
  });
}

function _prepareEntry(feed, entry) {
  let newEntry = {
    id: -1,
    feedId: feed.id,
    guid: entry.guid ? entry.guid : entry.link,
        link: entry.link,
    title: entry.title,
    description: entry.content,
    date: _toDate(entry.isoDate || entry.pubDate),
    isRead: Boolean(false),
    isViewed: Boolean(false),
    isFavorite: Boolean(false),
  };

  return newEntry;
}

/** Parses a feed date, falling back to "now" when it is missing or broken. */
function _toDate(value) {
  const date = value ? new Date(value) : new Date();

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function _addEntry(entry) {
  return new Promise((resolve, reject) => {
    const date = entry.date.toISOString();

    db.get(
      "SELECT id, read, viewed, favorite FROM entries WHERE feed_id = ? AND guid = ?",
      [entry.feedId, entry.guid],
      function (error, row) {
        if (error) {
          reject(error);
          return;
        }

        if (row) {
          // The entry is already known: refresh the fields that come from the
          // feed and keep the user flags (read / viewed / favorite) as they
          // are.
          db.run(
            "UPDATE entries SET link = ?, title = ?, description = ?, date = ? WHERE id = ?",
            [entry.link, entry.title, entry.description, date, row.id],
            (error) => {
              if (error) {
                reject(error);
                return;
              }

              entry.id = row.id;
              entry.isRead = Boolean(row.read);
              entry.isViewed = Boolean(row.viewed);
              entry.isFavorite = Boolean(row.favorite);

              resolve(entry);
            }
          );
        } else {
          db.run(
            "INSERT INTO entries (feed_id, guid, link, title, description, read, viewed, favorite, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
            ],
            function (error) {
              if (error) {
                reject(error);
              } else {
                entry.id = this.lastID;
                resolve(entry);
              }
            }
          );
        }
      }
    );
  });
}

function _convertRowFeed(row) {
  let item = {
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
    total: 0,
    count: 0,
  };

  if (row.total) {
    item.total = row.total;
  }

  return item;
}
