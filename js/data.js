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

function addNewFeed(link, callback) {
	$.ajax({
		url: "api.php",
		dataType: "json",
		data: { action: "feed_add", link: link },
	}).done(function(response) {
		callback(response);
	});
}

function deleteFeed(id, callback) {
	$.ajax({
		url: "api.php",
		dataType: "json",
		data: { action: "feed_delete", id: id },
	}).done(function(response) {
		callback(response);
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
	/*$.ajax({
    	url: "api.php",
    	dataType: "json",
    	data: { action: "mark_as_read", id: id },
	}).done(function(response) {
		callback(response);
	});*/
}
