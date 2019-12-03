const db = require('../db');

module.exports.getFeeds = function() {
    return new Promise((resolve, reject) => {
        db.all('SELECT f.id, f.rss, f.link, f.title, f.description, f.image, f.active, f.status, f.last_update, f.deleted FROM feeds f', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let items = [];
    
                rows.forEach((row) => {
                    let item = { 
                        id: row.id, 
                        rss: row.rss, 
                        link: row.link, 
                        title: row.title, 
                        description: row.description, 
                        image: row.image, 
                        active: Boolean(row.active),
                        status: row.status,
                        lastUpdate: row.last_update,
                        deleted: Boolean(row.deleted)
                    };

                    items.push(item);
                });
    
                resolve(items);
            }
        });
    });
}