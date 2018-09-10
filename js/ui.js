var startCount = 0;
var channels = [];

var mainMenu;
var reloadButton;
var readMoreButton;

function fillNews(data) {
	let content = document.getElementById('content');
	content.innerHTML = '';
	
	data.forEach((entry) => {	
		let entryItem = createEntry(entry);
		content.appendChild(entryItem);
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
		let feedId = item.getAttribute('identifier');

		markAsRead(feedId).then(() => {
			item.classList.add('read');
		});
	});

	return item;
}

function updateMenu(data) {
	let menu = document.getElementById('menu-channels');
	menu.innerHTML = '';
	
	channels = [];

	data.forEach((channel) => {
		let menuItem = createMenuItem(channel);
		menu.appendChild(menuItem);
	
		channels.push(channel);
	});
}

function createMenuItem(channel) {
	let item = document.createElement("div");
	item.className = 'menu-item';	
	item.setAttribute('feed_id', channel.id);
	
	let a = document.createElement('a');
	a.href = channel.link;

	let icon = document.createElement('div');
	icon.className = 'icon';
	icon.style.backgroundImage = `url(${a.protocol}//${a.hostname}/favicon.ico)`;	

	item.appendChild(icon);

	let title = document.createElement('div');
	title.className = 'title';
	title.innerText = channel.title;

	item.appendChild(title);

	let counter = document.createElement('div');
	counter.className = 'counter';
	counter.innerText = channel.count;

	item.appendChild(counter);	

	let deleteButton = document.createElement('div');
	deleteButton.className = 'deleteButton hidden';
	deleteButton.innerHTML = '<svg><use xlink:href="img/icons.svg#delete"></use></svg';

	item.appendChild(deleteButton);

	if (channel.count == 0) {
		item.classList.add('empty');
	}

	item.addEventListener('click', () => {		
		toggleChannel(item);
		showSelectedChannels();
	});

	deleteButton.addEventListener('click', () => {		
		/*var item = $(this).closest(".menu-item");

		deleteFeed(parseInt(item.attr("identifier")), function() {
			item.remove();
		});*/
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
	$("#menu-channels").find(".menu-item").each(function() {
		var id = parseInt($(this).attr("feed_id"));

		var count = $("#content").find(".entry[feed_id='" + id + "']").length;
		$(this).find(".counter").text(count);

		if (count == 0) {
			$(this).addClass("empty");
		} else {
			$(this).removeClass("empty");
		}
	});
}

function showAddForm() {
	$("#menu-channels-add-form").removeClass("hidden");

	$("#menu-channels-item-add").addClass("hidden");
	$("#menu-channels-item-edit").addClass("hidden");

	$("#menu-channels-add-form-link").focus();
}

function hideAddForm() {
	$("#menu-channels-add-form").addClass("hidden");

	$("#menu-channels-item-add").removeClass("hidden");
	$("#menu-channels-item-edit").removeClass("hidden");

	$("#menu-channels-add-form-link").val("");
	$("#menu-channels-add-form-link").removeClass("error");
	$("#menu-channels-add-form-link").attr("link", "");
}

function editMenu() {
	if ($("#menu-channels-item-edit").hasClass("active")) {
		$("#menu-channels-item-edit").removeClass("active");

		$("#menu-channels").find(".menu-item").each(function() {
			$(this).removeClass("editing");
			$(this).find(".counter").removeClass("hidden");
			$(this).find(".deleteButton").addClass("hidden");
		});
	} else {
		$("#menu-channels-item-edit").addClass("active");

		$("#menu-channels").find(".menu-item").each(function() {
			$(this).addClass("editing");
			$(this).find(".counter").addClass("hidden");
			$(this).find(".deleteButton").removeClass("hidden");
		});
	}
}

function updateNews() {
	reloadButton.classList.add('active');

	getNews().then((data) => {
		console.log(data);
		reloadButton.classList.remove('active');

		data.items.sort((a, b) => {
			return b.id - a.id;
		});

		updateMenu(data.channels);
		fillNews(data.items);

		if (data.items.length < parseInt(data.total)) {
			startCount = data.items.length;
			readMoreButton.classList.remove('hidden');
		}
	});
}

function addFeed() {
	var field = $("#menu-channels-add-form-link");
	var link = field.val().trim();

	if (link.length > 0) {
		$("#menu-channels-add-form").addClass("disabled");
		reloadButton.classList.add('active');

		addNewFeed(link, function(response) {
			console.log(response);
			$("#menu-channels-add-form").removeClass("disabled");
			reloadButton.classList.remove('active');

			if (response.error) {
				field.attr("link", link);
				field.addClass("error");
				field.val(response.info);
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

		startCount = startCount + data.length;

		let content = document.getElementById('content');

		data.forEach((entry) => {
			let entryItem = createEntry(entry);
			content.appendChild(entryItem);
		});

		updateEntriesCount();
	});
}

function showSelectedChannels() {
	let channelItems = Array.from(document.getElementById('menu-channels').childNodes);
	
	let ids = channelItems.filter((item) => {
		return item.classList.contains('selected');
	}).map((item) => {
		return parseInt(item.getAttribute('feed_id'));
	});
	
	$("#content").find(".entry").each(function() {
		var id = parseInt($(this).attr("feed_id"));
	
		$(this).removeClass("hidden");

		if (ids.length > 0 && ids.indexOf(id) == -1) {
			$(this).addClass("hidden");	
		}
	});

	window.scrollTo(0, 0);
}

function getChannelById(id) {
	let result = null;

	channels.forEach((channel) => {
		if (parseInt(channel.id) == id) {
			result = channel;
		}
	});

	return result;
}

function init() {
	mainMenu = document.getElementById('menu');
	readMoreButton = document.getElementById('read-more');
	reloadButton = document.getElementById('reload-button');

	reloadButton.addEventListener('click', () => {
		updateNews();
	});

	readMoreButton.classList.add('hidden');
	$("#menu-channels-add-form").addClass("hidden");

	getFeeds().then((data) => {
		updateMenu(data);

		var total = 0;

		data.forEach((channel) => {
			total = total + channel.total;
		});

		if (total > 0) {
			readMoreButton.classList.remove('hidden');
		}
	});

	
	readMoreButton.addEventListener('click', () => {
		getViewedNews();
	});

	$("#menu-channels-item-add").click(function() {
		showAddForm();
	});

	$("#menu-channels-add-form-close").click(function() {
		hideAddForm();
	});

	$("#menu-channels-item-edit").click(function() {
		editMenu();
	});

	$("#menu-channels-add-form-add").click(function() {
		addFeed();
	});

	$("menu-channels-add-form-link").on("focus", function() {
		if ($(this).hasClass("error")) {
			$(this).removeClass("error");
			$(this).val($(this).attr("link"));
		}
	});

	window.addEventListener('scroll', function(e) {
		if (window.scrollY > 120) {
			mainMenu.classList.add('fixed');
		} else {
			mainMenu.classList.remove('fixed');
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
    init();
}, false);
