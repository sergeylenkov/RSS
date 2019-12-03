const db = require('../db');
const Parser = require('rss-parser');
const feeds = require('./feeds');

module.exports.updateFeeds = function() {
    return new Promise((resolve, reject) => {
        let items = [];

        feeds.getFeeds().then((data) => {            
            const rss = data.filter((item) => {
                return item.deleted == false;
            });

            let promises = [];

            rss.forEach(element => {                
                const promise = _updateFeed(element.rss).then((entries) => {                    
                    items = items.concat(entries);
                }).catch((error) => {

                });
                
                promises.push(promise);
            });

            Promise.all(promises).then(() => {
                resolve(items);
            }).catch((error) => {
                console.log(error);
            });
        });
    });
}

function _updateFeed(link) {
    return new Promise((resolve, reject) => {
        console.log('_updateFeed', link);
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