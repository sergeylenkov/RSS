var apiUrl = 'api.php?';

function getNews() {
	return new Promise((resolve) => {
		fetch(`${apiUrl}action=new`).then((response) => {				 
			return response.json();
		}).then((data) => {
			resolve(data);
		});
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
		fetch(`${apiUrl}action=feeds`).then((response) => {				 
			return response.json();
		}).then((data) => {
			resolve(data);
		});
	});
}

function getAllNews(from, to) {
	return new Promise((resolve) => {
		fetch(`${apiUrl}action=news_all&from=${from}&to=${to}`).then((response) => {				 
			return response.json();
		}).then((data) => {
			resolve(data);
		});
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
