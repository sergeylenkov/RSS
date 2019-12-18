export class DataHelper {
    constructor(url) {
        this.url = url;        

        this._feeds = [];
        this._feedsDict = {};
    }

    update() {
        return new Promise((resolve) => {
            fetch(`${this.url}feeds/update`).then((response) => {
                return response.json();
            }).then((data) => {
                this.updateFeedsInEntries(data);
                resolve(data);
            });
        });
    }

    getFeeds() {   
        return new Promise((resolve) => {
            fetch(`${this.url}feeds`).then((response) => {
                return response.json();
            }).then((data) => {
                this._feeds = data;

                this._feeds.forEach(feed => {
                    const a = document.createElement('a');
                    a.href = feed.link;

                    if (feed.image && feed.image.length > 0) {
                        feed.icon = feed.image;
                    } else {
                        const icon = `${a.protocol}//${a.hostname}/favicon.ico`;
                        feed.icon = icon;
                    }

                    this._feedsDict[feed.id] = feed;
                });

                resolve(data);
            });
        });
    }

    getAllNews(from, to) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=news_all&from=${from}&to=${to}`).then((response) => {
                return response.json();
            }).then((data) => {
                this.updateFeedsInEntries(data);
                resolve(data);
            });
        });
    }

    getReadNews(from, to) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=news_read&from=${from}&to=${to}`).then((response) => {
                return response.json();
            }).then((data) => {
                this.updateFeedsInEntries(data);
                resolve(data);
            });
        });
    }

    getBookmarkNews(from, to) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=news_bookmark&from=${from}&to=${to}`).then((response) => {
                return response.json();
            }).then((data) => {
                this.updateFeedsInEntries(data);
                resolve(data);
            });
        });
    }

    getUnviewed() {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/unviewed`).then((response) => {
                return response.json();
            }).then((data) => {
                this.updateFeedsInEntries(data);
                resolve(data);
            });
        });
    }
    
    setViewed(ids) {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/view`, {
                method: 'POST',
                body: JSON.stringify({ ids: ids }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {                
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }
    
    setRead(id) {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/${id}/read`, {
                method: 'PUT'
            }).then((response) => {				 
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }

    setFavorite(id, isFavorite) {
        return new Promise((resolve) => {
            let method = isFavorite ? 'PUT' : 'DELETE';
            
            fetch(`${this.url}entries/${id}/favorite`, {
                method: method
            }).then((response) => {				 
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });    
    }

    totalCount() {
        return new Promise((resolve) => {
            fetch(`${this.url}action=total`).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }

    addFeed(link) {
        return new Promise((resolve) => {
            fetch(`${this.url}feeds`, {
                method: 'POST',
                body: JSON.stringify({ link: link }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {				 
                return response.json();
            }).then((data) => {                
                resolve(data);
            });
        });
    }
    
    deleteFeed(id) {
        return new Promise((resolve) => {
            fetch(`${this.url}feeds/${id}/delete`).then((response) => {				 
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }

    getFeedById(id) {
        return this._feedsDict[id];
    }

    updateFeedsInEntries(entries) {
        entries.forEach(entry => {
            entry.feed = this.getFeedById(entry.feedId);
        });
    }
}



