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

module.exports.setViewed = function(ids) {
    return new Promise((resolve, reject) => {
        const idsQuery = ids.join(',');

        db.run(`UPDATE entries SET viewed = ? WHERE id IN(${idsQuery})`, [true], function(error) {
            if (error) {
                reject(error);
            } else {        
                resolve({ ids: ids, viewed: true });
            }
        });
    });   
}

module.exports.setRead = function(ids) {
    return new Promise((resolve, reject) => {
        const idsQuery = ids.join(',');

        db.run(`UPDATE entries SET read = ? WHERE id IN(${idsQuery})`, [true], function(error) {
            if (error) {
                reject(error);
            } else {        
                resolve({ ids: ids, read: true });
            }
        });
    });   
}