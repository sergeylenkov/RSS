const db = require("../db");
const utils = require("../utils");

module.exports.all = function () {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM entries ORDER BY date DESC LIMIT ?",
      [30],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        let items = [];

        rows.forEach((row) => {
          const item = _convertRowEntry(row);
          items.push(item);
        });

        resolve(items);
      }
    );
  });
};

module.exports.unviewed = function () {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM entries WHERE viewed = ? ORDER BY date DESC",
      [false],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        let items = [];

        rows.forEach((row) => {
          const item = _convertRowEntry(row);
          items.push(item);
        });

        resolve(items);
      }
    );
  });
};

module.exports.favorites = function () {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM entries WHERE favorite = ? ORDER BY date DESC",
      [true],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        let items = [];

        rows.forEach((row) => {
          const item = _convertRowEntry(row);
          items.push(item);
        });

        resolve(items);
      }
    );
  });
};

module.exports.read = function () {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM entries WHERE read = ? ORDER BY date DESC",
      [true],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        let items = [];

        rows.forEach((row) => {
          const item = _convertRowEntry(row);
          items.push(item);
        });

        resolve(items);
      }
    );
  });
};

module.exports.setViewed = function (ids) {
  return new Promise((resolve, reject) => {
    // Only numeric ids are accepted: the list is interpolated as placeholders,
    // never as raw SQL, so a malformed payload cannot inject a query.
    const values = (Array.isArray(ids) ? ids : [])
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id));

    if (values.length === 0) {
      resolve({ ids: [], isViewed: true });
      return;
    }

    const placeholders = values.map(() => "?").join(",");

    db.run(
      `UPDATE entries SET viewed = ? WHERE id IN(${placeholders})`,
      [true, ...values],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ ids: values, isViewed: true });
        }
      }
    );
  });
};

module.exports.setRead = function (id, isRead) {
  const entryId = Number(id);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE entries SET read = ? WHERE id = ?`,
      [isRead, entryId],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ id: entryId, isRead: isRead });
        }
      }
    );
  });
};

module.exports.setFavorite = function (id, isFavorite) {
  const entryId = Number(id);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE entries SET favorite = ? WHERE id = ?`,
      [isFavorite, entryId],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ id: entryId, isFavorite: isFavorite });
        }
      }
    );
  });
};

module.exports.clear = function (days) {
  return new Promise((resolve, reject) => {
    const keep = Number(days);

    if (!Number.isInteger(keep) || keep < 0) {
      reject({ message: "Days must be a non-negative integer" });
      return;
    }

    const date = new Date();
    date.setDate(date.getDate() - keep);

    // Old entries are removed unless the user marked them as favorite.
    db.run(
      `DELETE FROM entries WHERE date < ? AND favorite = ?`,
      [date.toISOString(), false],
      function (error) {
        if (error) {
          reject(error);
          return;
        }

        const removed = this.changes;

        db.run("VACUUM", [], (vacuumError) => {
          if (vacuumError) {
            // Cleanup is best effort: entries are already gone.
            utils.log("VACUUM error", vacuumError);
          }

          resolve({ days: keep, removed: removed });
        });
      }
    );
  });
};

function _convertRowEntry(row) {
  const item = {
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

  return item;
}
