const apiUrl = 'api.php?';
const native = false;

function updateFeeds() {
    return new Promise((resolve) => {
        if (native) {
            bridge.call('updateFeeds').then((result) => {
                let data = JSON.parse(result);
                resolve(data);
            });
        } else {
            fetch(`${apiUrl}action=update`).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        }
	});
}

function addNewFeed(link) {
    return new Promise((resolve) => {
		fetch(`${apiUrl}action=feed_add&link=${link}`).then((response) => {				 
			return response.json();
		}).then((data) => {
			resolve(data);
		});
    });
}

function deleteFeed(id) {
    return new Promise((resolve) => {
		fetch(`${apiUrl}action=feed_delete&id=${id}`).then((response) => {				 
			return response.json();
		}).then((data) => {
			resolve(data);
		});
	});
}

function getFeeds() {   
    return new Promise((resolve) => {
        if (native) {
            bridge.call('getFeeds').then((result) => {
                let data = JSON.parse(result);
                resolve(data);
            });
        } else {
            fetch(`${apiUrl}action=feeds`).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        }
	});
}

function getAllNews(from, to) {
    return new Promise((resolve) => {
        if (native) {
            bridge.call('getAllNews', { from: from, to: to }).then((result) => {
                let data = JSON.parse(result);
                resolve(data);
            });
        } else {
            fetch(`${apiUrl}action=news_all&from=${from}&to=${to}`).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        }
	});
}

function getUnviewed() {
    return new Promise((resolve) => {
        if (native) {
            bridge.call('getUnviewed').then((result) => {
                let data = JSON.parse(result);
                resolve(data);
            });
        } else {
            fetch(`${apiUrl}action=unviewed`).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        }
    });
}

function markAsRead(id) {
    return new Promise((resolve) => {
		fetch(`${apiUrl}action=mark_as_read&id=${id}`).then((response) => {				 
			return response.json();
		}).then((data) => {
			resolve(data);
		});
	});
}

function markAsViewed(ids) {
    return new Promise((resolve) => {
        let idsParam = ids.join(',');

        if (native) {
            bridge.call('markAsViewed', { ids: idsParam }).then((result) => {
                let data = JSON.parse(result);
                resolve(data);
            });
        } else {
            fetch(`${apiUrl}action=mark_as_viewed&ids=${idsParam}`).then((response) => {				 
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        }
	});
}

function getTotalCount() {
    return new Promise((resolve) => {
        if (native) {
            bridge.call('getTotalCount').then((result) => {
                let data = JSON.parse(result);
                resolve(data);
            });
        } else {
            fetch(`${apiUrl}action=total`).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        }
    });
}