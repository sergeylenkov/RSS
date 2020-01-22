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

    allEntries() {
        return new Promise((resolve) => {
            fetch(`${this.url}entries`).then((response) => {
                return response.json();
            }).then((data) => {
                this.updateFeedsInEntries(data);
                resolve(data);
            });
        });
    }

    readEntries() {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/read`).then((response) => {
                return response.json();
            }).then((data) => {
                this.updateFeedsInEntries(data);
                resolve(data);
            });
        });
    }

    getFavorites() {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/favorites`).then((response) => {
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

    setRead(id, isRead) {
        return new Promise((resolve) => {
            const method = isRead ? 'PUT' : 'DELETE';

            fetch(`${this.url}entries/${id}/read`, {
                method: method
            }).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }

    setFavorite(id, isFavorite) {
        return new Promise((resolve) => {
            const method = isFavorite ? 'PUT' : 'DELETE';

            fetch(`${this.url}entries/${id}/favorite`, {
                method: method
            }).then((response) => {
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

    updateFeed(id, data) {
        return new Promise((resolve) => {
            fetch(`${this.url}feeds/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
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
            fetch(`${this.url}feeds/${id}`, {
                method: 'DELETE'
            }).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }

    clearEntries(days) {
        return new Promise((resolve) => {
            fetch(`${this.url}entries/clear/${days}`).then((response) => {
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
