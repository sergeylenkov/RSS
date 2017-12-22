function getNews(callback) {
	$("#content").html("Загружаю...");
	$("#read-more").hide();

	$.ajax({
    	url: "api.php",
    	dataType: "json",
    	data: { action: "new" },
	}).done(function(response) {
		callback(response);
	});
}

function fillNews(data) {
	$("#content").html("");

	data.forEach((entry) => {
		console.log(entry);

		var item = $("<div/>", { class: "entry" });
		console.log(entry.description.length);
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

		$("#content").append(item);

		clearLinks(description, entry.link);
	});
}

function updateMenu(data) {
	$("#menu").html("");

	data.forEach((channel) => {
		var item = $("<div/>", { class: "menu-item" });

		item.append($("<div/>", { class: "title", text: channel.title }));
		item.append($("<div/>", { class: "counter", text: channel.count }));

		if (channel.count == 0) {
			item.addClass("empty");
		}

		$("#menu").append(item);
	});
}

function clearLinks(item, link) {
	var links = [];

	item.find("a").each(function() {
		var href = $(this)[0].getAttribute("href");

		if (href.indexOf(link) != -1) {
			links.push($(this));
		}
	});

	for (var i = 0; i < links.length; i++) {
		links[i].remove();
	}
}

$(document).ready(function() {
	getNews(function(data) {
		console.log(data);
		updateMenu(data.channels);
		fillNews(data.entries);
	});
});
