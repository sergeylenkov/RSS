var startCount = 0;
var totalCount = 0;

var feeds = [];
var entries = [];
var entryItems = [];
var menuItems = [];

var mainMenu;
var feedsMenu;
var reloadButton;
var readMoreButton;
var feedAddForm;
var addFeedButton;
var editFeedButton;
var formLinkField;
var formCloseButton;

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function throttled(func, delay) {
	let lastCall = 0;
	return function (...args) {
	  	const now = (new Date).getTime();
	  	if (now - lastCall < delay) {
			return;
		}
		  
	  	lastCall = now;
	  	return func(...args);
	}
}

function fillNews(data) {
	let content = document.getElementById('content');
	content.innerHTML = '';
	
	data.forEach((entry) => {	
		let entryItem = createEntry(entry);
		content.appendChild(entryItem);

		entryItems.push({ entry: entry, item: entryItem });
		entries.push(entry);
	});
}

function createEntry(entry) {
	let item = document.createElement('div');
	item.className = 'entry';
		
	item.setAttribute('identifier', entry.id);
	item.setAttribute('feed_id', entry.feed_id);

	if (entry.description.length > 1500 && entry.description.length < 2500) {
		item.classList.add('long');
	} else if (entry.description.length >= 2500 && entry.description.length < 4000) {
		item.classList.add('verylong');
	} else if (entry.description.length >= 4000) {
		item.classList.add('veryverylong');
	}

	let title = document.createElement('div');
	title.className = 'title';

	let link = document.createElement('a');
	link.setAttribute('href', entry.link);
	link.innerText = entry.title;
	
	title.appendChild(link);
	item.appendChild(title);

	let channel = getChannelById(parseInt(entry.feed_id));

	if (channel) {
		let channelItem = document.createElement('div');
		channelItem.className = 'channel';

		let icon = document.createElement('div');
		icon.className = 'channel-icon';

		var a = document.createElement('a');
		a.href = channel.link;

		icon.style.backgroundImage = `url(${a.protocol}//${a.hostname}/favicon.ico)`;

		channelItem.appendChild(icon);

		let channelTitle = document.createElement('div');
		channelTitle.className = 'channel-title';
		channelTitle.innerText = channel.title;

		channelItem.appendChild(channelTitle);

		item.appendChild(channelItem);
	}

	let description = document.createElement('div');
	description.className = 'description';
	description.innerHTML = entry.description;

	item.appendChild(description);

	if (parseInt(entry.read)) {
		item.classList.add('read');
	}

	clearSelfLinks(description, entry.link);

	if (item.getElementsByTagName('img').length > 3) {
		item.classList.add('images');
	}

	title.addEventListener('mouseup', () => {
		let entryId = item.getAttribute('identifier');

		markAsRead(entryId).then(() => {
			item.classList.add('read');
		});
	});

	return item;
}

function updateMenu(data) {	
	feedsMenu.innerHTML = '';
	
	feeds = [];
	menuItems = [];

	data.forEach((feed) => {
		let menuItem = createMenuItem(feed);
		feedsMenu.appendChild(menuItem);
	
		feeds.push(feed);
		menuItems.push({ feed: feed, item: menuItem });
	});
}

function createMenuItem(feed) {
	let item = document.createElement("div");
	item.className = 'menu-item';	
	item.setAttribute('feed_id', feed.id);
	
	let a = document.createElement('a');
	a.href = feed.link;

	let icon = document.createElement('div');
	icon.className = 'icon';
	icon.style.backgroundImage = `url(${a.protocol}//${a.hostname}/favicon.ico)`;	

	item.appendChild(icon);

	let title = document.createElement('div');
	title.className = 'title';
	title.innerText = feed.title;

	item.appendChild(title);

	let counter = document.createElement('div');
	counter.className = 'counter';
	counter.innerText = feed.count;

	item.appendChild(counter);	

	let deleteButton = document.createElement('div');
	deleteButton.className = 'deleteButton';
	deleteButton.innerHTML = '<svg><use xlink:href="static/icons.svg#delete"></use></svg';

	item.appendChild(deleteButton);

	item.title = title;
	item.counter = counter;

	if (feed.count == 0) {
		item.classList.add('empty');
	}

	item.addEventListener('click', () => {		
		toggleChannel(item);
		showSelectedChannels();
	});

	deleteButton.addEventListener('click', () => {		
		let feedId = parseInt(item.getAttribute('identifier'));

		deleteFeed(feedId).then(() => {
			item.remove();
		});
	});

	return item;
}

function toggleChannel(sender) {
	sender.classList.toggle('selected');
}

function clearSelfLinks(description, link) {	
	let items = Array.from(description.getElementsByTagName('a'));

	let links = items.filter((item) => {
		let href = item.getAttribute('href');

		if (href && href.indexOf(link) != -1) {
			return true;
		}

		return false;
	});

	for (let i = 0; i < links.length; i++) {
		links[i].remove();
	}
}

function updateEntriesCount() {
	menuItems.forEach(menuItem => {
		let feed = menuItem.feed;
		let item = menuItem.item;

		let feedItems = entries.filter((entry) => {
			return entry.feed_id == feed.id;
		});

		let count = feedItems.length;

		item.counter.innerText = count;

		if (count == 0) {
			item.classList.add('empty');
		} else {
			item.classList.remove('empty');
		}
	});
}

function showAddForm() {
	feedAddForm.classList.remove('hidden');
	addFeedButton.classList.add('hidden');
	editFeedButton.classList.add('hidden');

	formLinkField.focus();
}

function hideAddForm() {
	feedAddForm.classList.add('hidden');

	addFeedButton.classList.remove('hidden');
	editFeedButton.classList.remove('hidden');

	formLinkField.value = '';
	formLinkField.classList.remove('error');
	formLinkField.setAttribute('link', "");
}

function editMenu() {
	if (editFeedButton.classList.contains('active')) {
		editFeedButton.classList.remove('active');
		feedsMenu.classList.remove('editing');
	} else {
		editFeedButton.classList.add('active');
		feedsMenu.classList.add('editing');
	}
}

function updateNews() {
	reloadButton.classList.add('active');

	entries = [];
	entryItems = [];
	
	updateFeeds().then((data) => {
		console.log(data);
		reloadButton.classList.remove('active');
		
		fillNews(data);
		updateEntriesCount();

		if (data.length < totalCount) {
			startCount = data.length;
			readMoreButton.classList.remove('hidden');
		}

		// set viewed first page on user action
		setTimeout(() => {
			let _updateViewed = () => {				
				updateViewed(true);
				window.removeEventListener('mousemove', _updateViewed);
			}
	
			window.addEventListener('mousemove', _updateViewed);
		}, 3000);		
	});
}

function addFeed() {
	let link = formLinkField.value.trim();

	if (link.length > 0) {
		feedAddForm.classList.add('disabled');
		reloadButton.classList.add('active');

		addNewFeed(link).then((response) => {
			console.log(response);
			feedAddForm.classList.remove('disabled');
			reloadButton.classList.remove('active');

			if (response.error) {
				formLinkField.setAttribute('link', link);
				formLinkField.classList.add('error');
				formLinkField.value = response.info;
			} else {				
				hideAddForm();

				response.channel.count = response.items.length;
				appendMenuItem(response.channel);

				response.items.forEach((entry) => {
					appendEntry(entry);
				});
			}
		});
	}
}

function getViewedNews() {
	reloadButton.classList.add('active');

	getAllNews(startCount, startCount + 30).then((data) => {
		reloadButton.classList.remove('active');
		console.log(data);
		startCount = startCount + data.length;

		let content = document.getElementById('content');

		data.forEach((entry) => {
			let entryItem = createEntry(entry);
			content.appendChild(entryItem);

			entryItems.push({ entry: entry, item: entryItem });
			entries.push(entry);
		});

		updateEntriesCount();
	});
}

function showSelectedChannels() {
	let channelItems = Array.from(feedsMenu.childNodes);
	
	let ids = channelItems.filter((item) => {
		return item.classList.contains('selected');
	}).map((item) => {
		return parseInt(item.getAttribute('feed_id'));
	});

	entryItems.forEach(entryItem => {		
		let id = parseInt(entryItem.entry.feed_id);

		if (ids.length > 0 && ids.indexOf(id) == -1) {
			entryItem.item.classList.add('hidden');
		} else {
			entryItem.item.classList.remove('hidden');
		}
	});

	window.scrollTo(0, 0);
}

function getChannelById(id) {
	let result = null;

	feeds.forEach((channel) => {
		if (parseInt(channel.id) == id) {
			result = channel;
		}
	});

	return result;
}

function updateViewed(force) {
	let ids = [];

	entryItems.forEach(entryItem => {
		if (!parseInt(entryItem.entry.viewed)) {
			let rect = entryItem.item.getBoundingClientRect();
			let height = window.innerHeight / 2;

			if (force) {
				height = window.innerHeight;
			}
			if (rect.top < height) {
				entryItem.entry.viewed = 1;
				ids.push(entryItem.entry.id);
			}
		}
	});

	if (ids.length > 0) {
		markAsViewed(ids);
		updateViewedCount();
	}
}

function updateViewedCount() {
	menuItems.forEach(menuItem => {
		let feed = menuItem.feed;
		let item = menuItem.item;

		let feedItems = entries.filter((entry) => {
			if (entry.feed_id == feed.id && !parseInt(entry.viewed)) {
				return true;
			}

			return false;
		});

		let count = feedItems.length;

		item.counter.innerText = count;

		if (count == 0) {
			item.classList.add('empty');
		} else {
			item.classList.remove('empty');
		}
	});
}

function getUnviewedNews() {
	getUnviewed().then((data) => {
		console.log(data);		
		fillNews(data);
		updateEntriesCount();

		setTimeout(() => {
			let _updateViewed = () => {				
				updateViewed(true);
				window.removeEventListener('mousemove', _updateViewed);
			}
	
			window.addEventListener('mousemove', _updateViewed);
		}, 3000);
	});
}

function init() {
	mainMenu = document.getElementById('menu');
	feedsMenu = document.getElementById('menu-channels');
	readMoreButton = document.getElementById('read-more');
	reloadButton = document.getElementById('reload-button');
	feedAddForm = document.getElementById('menu-channels-add-form');
	addFeedButton = document.getElementById('menu-channels-item-add');
	editFeedButton = document.getElementById('menu-channels-item-edit');
	formLinkField = document.getElementById('menu-channels-add-form-link');
	formCloseButton = document.getElementById('menu-channels-add-form-close');
	formSendButton = document.getElementById('menu-channels-add-form-add');

	reloadButton.addEventListener('click', () => {
		updateNews();
	});

	readMoreButton.addEventListener('click', () => {
		getViewedNews();
	});

	addFeedButton.addEventListener('click', () => {
		showAddForm();
	});

	editFeedButton.addEventListener('click', () => {
		editMenu();
	});

	formCloseButton.addEventListener('click', () => {
		hideAddForm();
	});	

	formSendButton.addEventListener('click', () => {
		addFeed();
	});

	formLinkField.addEventListener('focus', () => {
		if (formLinkField.classList.contains('error')) {
			formLinkField.formLink.remove('error');
			formLinkField.value = formLinkField.getAttribute('link');
		}
	});

	readMoreButton.classList.add('hidden');
	feedAddForm.classList.add('hidden');

	getFeeds().then((data) => {
		updateMenu(data);
		getUnviewedNews();
	});	

	getTotalCount().then((count) => {
		totalCount = parseInt(count);
		
		if (totalCount > 0) {
			readMoreButton.classList.remove('hidden');
		}
	});

	let _updateViewed = throttled(() => {
		updateViewed(false);
	}, 500);

	window.addEventListener('scroll', (e) => {
		if (window.scrollY > 80) {
			mainMenu.classList.add('fixed');
		} else {
			mainMenu.classList.remove('fixed');
		}

		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			this.console.log('scroll to end');
			updateViewed(true);
		} else {
			_updateViewed(false);
		}		
	});
}

document.addEventListener('DOMContentLoaded', () => {
    init();
}, false);
