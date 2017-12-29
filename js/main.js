var startCount = 0;

function getNews(callback) {
	$.ajax({
    	url: "api.php",
    	dataType: "json",
    	data: { action: "new" },
	}).done(function(response) {
		callback(response);
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

function getFeeds(callback) {
	$.ajax({
    	url: "api.php",
    	dataType: "json",
    	data: { action: "feeds" },
	}).done(function(response) {
		callback(response);
	});
}

function getAllNews(from, to, callback) {
	$.ajax({
    	url: "api.php",
    	dataType: "json",
    	data: { action: "news_all", from: from, to: to },
	}).done(function(response) {
		callback(response);
	});
}

function markAsRead(id, callback) {
	$.ajax({
    	url: "api.php",
    	dataType: "json",
    	data: { action: "mark_as_read", id: id },
	}).done(function(response) {
		callback(response);
	});
}

function fillNews(data) {
	$("#content").html("");
	console.log(data);
	data.forEach((entry) => {
		console.log(entry);
		appendEntry(entry);
	});
}

function appendEntry(entry) {
	var item = $("<div/>", { class: "entry" });
		
	item.attr("identifier", entry.id);

	if (entry.description.length > 1500 && entry.description.length < 2500) {
		item.addClass("long");
	} else if (entry.description.length >= 2500 && entry.description.length < 4000) {
		item.addClass("verylong");
	} else if (entry.description.length >= 4000) {
		item.addClass("veryverylong");
	}

	var title = $("<div/>", { class: "title" });
	var description = $("<div/>", { class: "description", html: entry.description });

	title.append($("<a/>", { href: entry.link, text: entry.title }));

	item.append(title);
	item.append(description);

	if (entry.read) {
		item.addClass("read");
	}
	
	$("#content").append(item);

	clearLinks(description, entry.link);

	title[0].addEventListener("mouseup", function() {
		var item = $(this).closest(".entry");
		
		markAsRead(parseInt(item.attr("identifier")), function() {
			item.addClass("read");
		});
	});
}

function updateMenu(data) {
	$("#menu-channels").html("");

	data.forEach((channel) => {
		appendMenuItem(channel);
	});
}

function appendMenuItem(channel) {
	var item = $("<div/>", { class: "menu-item" });

	item.attr("identifier", channel.id);
		
	item.append($("<div/>", { class: "title", text: channel.title }));
	item.append($("<div/>", { class: "counter", text: channel.count }));

	if (channel.count == 0) {
		item.addClass("empty");
	}

	$("#menu-channels").append(item);
}

function clearLinks(item, link) {
	var links = [];

	item.find("a").each(function() {
		var href = $(this)[0].getAttribute("href");

		if (href && href.indexOf(link) != -1) {
			links.push($(this));
		}
	});

	for (var i = 0; i < links.length; i++) {
		links[i].remove();
	}
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
	} else {
		$("#menu-channels-item-edit").addClass("active");
	}
}

function updateNews() {
	$("#reload-button").addClass("active");

	getNews(function(data) {
		console.log(data);
		$("#reload-button").removeClass("active");

		updateMenu(data.channels);
		fillNews(data.items);

		if (data.items.length < parseInt(data.total)) {
			startCount = data.items.length;
			$("#read-more").removeClass("hidden");
		}
	});
}

function addFeed() {
	var field = $("#menu-channels-add-form-link");
	var link = field.val().trim();

	if (link.length > 0) {
		$("#menu-channels-add-form").addClass("disabled");
		$("#reload-button").addClass("active");

		addNewFeed(link, function(response) {
			console.log(response);
			$("#menu-channels-add-form").removeClass("disabled");
			$("#reload-button").removeClass("active");

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
	$("#reload-button").addClass("active");

	getAllNews(startCount, startCount + 30, (data) => {
		$("#reload-button").removeClass("active");

		startCount = startCount + data.length;

		data.forEach((entry) => {
			appendEntry(entry);
		});
	});
}

$(document).ready(function() {
	$("#read-more").addClass("hidden");
	$("#menu-channels-add-form").addClass("hidden");

	getFeeds((data) => {
		updateMenu(data);
	});

	$("#reload-button").click(() => {
		updateNews();
	});

	$("#read-more").click(() => {
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
});
