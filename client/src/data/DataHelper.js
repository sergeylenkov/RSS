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
    
    markAsViewed(ids) {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/view`, {
                method: 'POST',
                body: JSON.stringify({ ids: ids }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                console.log(response);
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }
    
    markAsRead(ids) {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/read`, {
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

    setFavorite(id) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=bookmark&id=${id}`).then((response) => {				 
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

    addNewFeed(link) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=feed_add&link=${link}`).then((response) => {				 
                return response.json();
            }).then((data) => {
                if (data.items) {
                    this.updateFeedsInEntries(data.items);
                }
                resolve(data);
            });
        });
    }
    
    deleteFeed(id) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=feed_delete&id=${id}`).then((response) => {				 
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



