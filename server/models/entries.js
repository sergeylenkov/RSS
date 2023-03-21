const db = require("../db");

module.exports.all = function () {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM entries ORDER BY date DESC LIMIT ?",
      [30],
      (error, rows) => {
        if (error) {
          reject(err);
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
    const idsQuery = ids.join(",");

    db.run(
      `UPDATE entries SET viewed = ? WHERE id IN(${idsQuery})`,
      [true],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ ids: ids, isViewed: true });
        }
      }
    );
  });
};

module.exports.setRead = function (id, isRead) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE entries SET read = ? WHERE id = ?`,
      [isRead, id],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ id: id, isRead: isRead });
        }
      }
    );
  });
};

module.exports.setFavorite = function (id, isFavorite) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE entries SET favorite = ? WHERE id = ?`,
      [isFavorite, id],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ id: id, isFavorite: isFavorite });
        }
      }
    );
  });
};

module.exports.clear = function (days) {
  return new Promise((resolve, reject) => {
    const date = new Date();
    date.setDate(date.getDate() - days);

    db.run(
      `DELETE FROM entries WHERE date < ? AND favorite = ? AND read = ?`,
      [date.toISOString(), false, false],
      (error) => {
        db.run("VACUUM", []);

        if (error) {
          reject(error);
        } else {
          resolve({ days: days });
        }
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
