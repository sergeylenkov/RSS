const db = require('../db');

module.exports.all = function() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM entries ORDER BY date DESC', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let items = [];
    
                rows.forEach((row) => {
                    const item = _convertRowEntry(row);
                    items.push(item);
                });
    
                resolve(items);
            }
        });
    });
}

module.exports.unviewed = function() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM entries WHERE viewed = ? ORDER BY date DESC', [false], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let items = [];
    
                rows.forEach((row) => {
                    const item = _convertRowEntry(row);
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

        db.run(`UPDATE entries SET viewed = ? WHERE id IN(${idsQuery})`, [true], (error) => {
            if (error) {
                reject(error);
            } else {        
                resolve({ ids: ids, isViewed: true });
            }
        });
    });   
}

module.exports.setRead = function(ids) {
    return new Promise((resolve, reject) => {
        const idsQuery = ids.join(',');

        db.run(`UPDATE entries SET read = ? WHERE id IN(${idsQuery})`, [true], (error) => {
            if (error) {
                reject(error);
            } else {        
                resolve({ ids: ids, isRead: true });
            }
        });
    });   
}

module.exports.setFavorite = function(id, isFavorite) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE entries SET favorite = ? WHERE id = ?`, [isFavorite, id], (error) => {
            if (error) {
                reject(error);
            } else {        
                resolve({ id: id, isFavorite: isFavorite });
            }
        });
    }); 
}

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
        date: row.date
    };

    return item;
}