const bridge = null;

export class DataHelper {
    constructor(url, native) {
        this.url = url;
        this.native = native;
    }

    update() {
        return new Promise((resolve) => {
            if (this.native) {
                bridge.call('updateFeeds').then((result) => {
                    let data = JSON.parse(result);
                    resolve(data);
                });
            } else {
                fetch(`${this.url}action=update`).then((response) => {
                    return response.json();
                }).then((data) => {
                    resolve(data);
                });
            }
        });
    }

    feeds() {   
        return new Promise((resolve) => {
            if (this.native) {
                bridge.call('getFeeds').then((result) => {
                    let data = JSON.parse(result);
                    resolve(data);
                });
            } else {
                fetch(`${this.url}action=feeds`).then((response) => {
                    return response.json();
                }).then((data) => {
                    resolve(data);
                });
            }
        });
    }

    allNews(from, to) {
        return new Promise((resolve) => {
            if (this.native) {
                bridge.call('getAllNews', { from: from, to: to }).then((result) => {
                    let data = JSON.parse(result);
                    resolve(data);
                });
            } else {
                fetch(`${this.url}action=news_all&from=${from}&to=${to}`).then((response) => {
                    return response.json();
                }).then((data) => {
                    resolve(data);
                });
            }
        });
    }

    unviewed() {
        return new Promise((resolve) => {
            if (this.native) {
                bridge.call('getUnviewed').then((result) => {
                    let data = JSON.parse(result);
                    resolve(data);
                });
            } else {
                fetch(`${this.url}action=unviewed`).then((response) => {
                    return response.json();
                }).then((data) => {
                    resolve(data);
                });
            }
        });
    }
    
    markAsViewed(ids) {
        return new Promise((resolve) => {
            let idsParam = ids.join(',');
    
            if (this.native) {
                bridge.call('markAsViewed', { ids: idsParam }).then((result) => {
                    let data = JSON.parse(result);
                    resolve(data);
                });
            } else {
                fetch(`${this.url}action=mark_as_viewed&ids=${idsParam}`).then((response) => {				 
                    return response.json();
                }).then((data) => {
                    resolve(data);
                });
            }
        });
    }
    
    markAsRead(id) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=mark_as_read&id=${id}`).then((response) => {				 
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }

    totalCount() {
        return new Promise((resolve) => {
            if (this.native) {
                bridge.call('getTotalCount').then((result) => {
                    let data = JSON.parse(result);
                    resolve(data);
                });
            } else {
                fetch(`${this.url}action=total`).then((response) => {
                    return response.json();
                }).then((data) => {
                    resolve(data);
                });
            }
        });
    }

    addNewFeed(link) {
        return new Promise((resolve) => {
            fetch(`${this.url}action=feed_add&link=${link}`).then((response) => {				 
                return response.json();
            }).then((data) => {
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
}



