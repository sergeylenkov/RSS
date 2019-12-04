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

            rss.forEach(element => {                
                const promise = _updateFeed(element.rss).then((entries) => {                    
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
        db.all('SELECT f.id, f.rss, f.link, f.title, f.description, f.image, f.active, f.status, f.last_update, f.deleted FROM feeds f', [], (error, rows) => {
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
                        deleted: Boolean(row.deleted)
                    };

                    items.push(item);
                });

                resolve(items);
            }
        });
    });
}

function _updateFeed(link) {
    return new Promise((resolve, reject) => {
        const parser = new Parser();
        parser.parseURL(link, (error, feed) => {            
            if (error) {
                reject(error);
            } else {
                resolve(feed.items);
            }
        });
    });
}