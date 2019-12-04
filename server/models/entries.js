const db = require('../db');

module.exports.all = function() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM entries ORDER BY date DESC', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let items = [];
    
                rows.forEach((row) => {
                    let item = { 
                        id: row.id,
                        feedId: row.feed_id,
                        guid: row.guid,
                        link: row.link,
                        title: row.title,
                        description: row.description,
                        isRead: row.read,
                        isViewed: row.viewed,
                        date: row.date
                    };

                    items.push(item);
                });
    
                resolve(items);
            }
        });
    });
}

module.exports.unviewed = function() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM entries WHERE viewed = 0 ORDER BY date DESC', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let items = [];
    
                rows.forEach((row) => {
                    let item = { 
                        id: row.id,
                        feedId: row.feed_id,
                        guid: row.guid,
                        link: row.link,
                        title: row.title,
                        description: row.description,
                        isRead: row.read,
                        isViewed: row.viewed,
                        date: row.date
                    };

                    items.push(item);
                });
    
                resolve(items);
            }
        });
    });
}