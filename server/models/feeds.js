const db = require('../db');
const Parser = require('rss-parser');

module.exports.all = function() {
    return new Promise((resolve, reject) => {
        _getFeeds().then((items) => {
            resolve(items);
        }).catch((error) => {
            reject(error);
        }) 
    });
}

module.exports.update = function() {
    return new Promise((resolve, reject) => {
        let items = [];

        _getFeeds().then((data) => {            
            const rss = data.filter((item) => {
                return item.deleted == false;
            });

            let promises = [];

            rss.forEach((feed) => {                
                const promise = _updateFeed(feed).then((entries) => {                   
                    items = items.concat(entries);
                }).catch((error) => {
                    console.log(error);
                });
                
                promises.push(promise);
            });

            Promise.all(promises).then(() => {
                resolve(items);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    });
}

function _getFeeds() {
    return new Promise((resolve, reject) => {        
        db.all('SELECT f.*, COUNT(e.id) as total FROM feeds f LEFT JOIN entries e ON e.feed_id = f.id WHERE f.deleted = 0 GROUP BY f.id', [], (error, rows) => {
            if (error) {
                reject(error);
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
                        deleted: Boolean(row.deleted),
                        total: row.total,
                        count: 0
                    };

                    items.push(item);
                });

                resolve(items);
            }
        });
    });
}

function _updateFeed(feed) {
    return new Promise((resolve, reject) => {
        const parser = new Parser();
        parser.parseURL(feed.rss, (error, rss) => {            
            if (error) {
                reject(error);
            } else {
                let items = [];
                let promises = [];

                rss.items.forEach((entry) => {
                    const newEntry = _prepareEntry(feed, entry);
                    const promise = _addEntry(newEntry).then((entry) => {
                        items.push(entry);
                    });

                    promises.push(promise);
                });

                Promise.all(promises).then(() => {
                    resolve(items);
                })
            }
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
        date: entry.isoDate,
        isRead: false,
        isViewed: false,
        isFavorite: false
    }

    return newEntry;
}

function _addEntry(entry) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, read, viewed, favorite FROM entries WHERE feed_id = ? AND guid = ?', [entry.feedId, entry.guid], function(error, row) {
            if (row) {
                entry.id = row.id;
                entry.isRead = row.read;
                entry.isViewed = row.viewed;
                entry.isFavorite = row.favorite;

                resolve(entry);
            } else { 
                db.run('INSERT INTO entries (feed_id, guid, link, title, description, read, viewed, favorite, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [entry.feedId, entry.guid, entry.link, entry.title, entry.description, false, false, false, entry.date], function(error) {
                    if (error) {
                        reject(error);
                    } else {
                        entry.id = this.lastID;
                        resolve(entry);
                    }
                });
            }
        });
    });    
}