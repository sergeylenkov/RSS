<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$db = new PDO("sqlite:database.sqlite");

$statement = $db->prepare("CREATE TABLE IF NOT EXISTS feeds (id INTEGER PRIMARY KEY, rss TEXT, link TEXT, title TEXT, description TEXT, image TEXT, active INTEGER, status TEXT, last_update TEXT, deleted INTEGER)");
$statement->execute();

$statement = $db->prepare("CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, feed_id INTEGER, guid TEXT, link TEXT, title TEXT, description TEXT, date TEXT, read INTEGER, viewed INTEGER, favorite INTEGER)");
$statement->execute();

if ($_GET["action"] == "feeds") {
	$channels = getFeeds();
	echo json_encode($channels);
}

if ($_GET["action"] == "update") {
	$items = array();

	updateFeeds();

	foreach ($db->query("SELECT * FROM entries WHERE viewed = 0 ORDER BY id DESC") as $row) {
		$items[] = array("id" => $row["id"], "feed_id" => $row["feed_id"], "guid" => $row["guid"], "link" => $row["link"], "title" => $row["title"], "description" => $row["description"], "read" => $row["read"], "viewed" => $row["viewed"], "date" => $row["date"]);
	}

	echo json_encode($items);	
}

if ($_GET["action"] == "news_all") {
	$items = array();
	$limit = $_GET["to"] - $_GET["from"];

	foreach ($db->query("SELECT * FROM entries ORDER BY id DESC LIMIT " . $limit . " OFFSET " . $_GET["from"]) as $row) {
		$items[] = array("id" => $row["id"], "feed_id" => $row["feed_id"], "guid" => $row["guid"], "link" => $row["link"], "title" => $row["title"], "description" => $row["description"], "read" => $row["read"], "viewed" => $row["viewed"], "date" => $row["date"]);
	}

	echo json_encode($items);
}

if ($_GET["action"] == "mark_as_read") {
	$statement = $db->prepare("UPDATE entries SET read = ? WHERE id = ?");
	$statement->execute(array(true, $_GET["id"]));

	echo json_encode(array("id" => $_GET["id"], "read" => true));
}

if ($_GET["action"] == "mark_as_viewed") {
	$statement = $db->prepare("UPDATE entries SET viewed = ? WHERE id IN(" . $_GET["ids"] . ")");
	$statement->execute(array(true));

	echo json_encode(array("ids" => $_GET["ids"], "viewed" => true));
}

if ($_GET["action"] == "feed_add") {
	$link = $_GET["link"];
	addFeed($link);	
}

if ($_GET["action"] == "feed_delete") {
	$statement = $db->prepare("UPDATE feeds SET deleted = ? WHERE id = ?");
	$statement->execute(array(true, $_GET["id"]));

	echo json_encode(array("id" => $_GET["id"], "deleted" => true));
}

if ($_GET["action"] == "total") {
	$total = $db->query("SELECT COUNT(*) FROM entries")->fetch();
	echo json_encode($total[0]);
}


function getFeeds() {
	global $db;
	$channels = array();

	foreach ($db->query("SELECT f.*, COUNT(e.id) as total FROM feeds f LEFT JOIN entries e ON e.feed_id = f.id WHERE f.deleted = 0 GROUP BY f.id") as $row) {
		$channels[] = array("id" => $row["id"], "rss" => $row["rss"], "link" => $row["link"], "title" => $row["title"], "description" => $row["description"], "image" => $row["image"], "count" => 0, "total" => $row["total"]);
	}

	return $channels;
}

function addFeed($link) {
	global $db;
	$xml = simplexml_load_file($link);

	$channel = parseChannel($xml);
	$channel["rss"] = $link;

	$result = $db->query("SELECT rss FROM feeds WHERE rss = '" . $link . "'")->fetch();
	
	if (empty($result)) {
		$statement = $db->prepare("INSERT INTO feeds (rss, link, title, description, image, active, status, last_update, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

		if ($statement->execute(array($channel["rss"], $channel["link"], $channel["title"], $channel["description"], $channel["image"], $channel["active"], $channel["status"], $channel["date"], (int)false))) {
			$channel["id"] = $db->lastInsertId();
			$items = parseItems($xml);

			foreach($items as $item) {
				addEntry($channel["id"], $item);
			}

			echo json_encode(array("channel" => $channel, "items" => $items));
		} else {
			echo json_encode(array("error" => true, "info" => $db->errorInfo()));
		}
	} else {
		echo json_encode(array("error" => true, "info" => "Канал уже есть в базе"));
	}
}

function updateFeeds() {
	$channels = getFeeds();
	
	foreach ($channels as &$channel) {	
		$xml = simplexml_load_file($channel["rss"]);
		$channelItems = parseItems($xml);

		foreach ($channelItems as &$item) {
			$item["feed_id"] = $channel["id"];
			$item["feed_image"] = $channel["image"];

			addEntry($channel["id"], $item);
		}
	}
}

function addEntry($feed, &$entry) {
	global $db;

	$result = $db->query("SELECT id FROM entries WHERE feed_id = " . $feed . " AND guid = '" . $entry["guid"] . "'")->fetch();

	if (empty($result)) {
		$statement = $db->prepare("INSERT INTO entries (feed_id, guid, link, title, description, read, viewed, favorite, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
		$statement->execute(array($feed, $entry["guid"], $entry["link"], $entry["title"], $entry["description"], (int)false, (int)false, (int)false, $entry["date"]));

		$entry["id"] = $db->lastInsertId();

		return true;
	}

	$entry["id"] = $result["id"];

	return false;
}

function parseChannel($xml) {
	$channel = array("id" => -1, "rss" => "", "link" => "", "title" => "", "description" => "", "active" => (int)true, "status" => "ok", "image" => "", "date" => date('Y-m-d H:i:s'));

	if ($xml->channel->title instanceof \SimpleXMLElement) {
		$channel["title"] = (string)$xml->channel->title[0];
	} else {
		$channel["title"] = $xml->channel->title;
	}

	if ($xml->channel->description instanceof \SimpleXMLElement) {
		$channel["description"] = (string)$xml->channel->description[0];
	} else {
		$channel["description"] = $xml->channel->description;
	}

	if ($xml->channel->link instanceof \SimpleXMLElement) {
		$channel["link"] = (string)$xml->channel->link[0];
	} else {
		$channel["link"] = $xml->channel->link;
	}

	if ($xml->channel->image) {
		if ($xml->channel->image->url instanceof \SimpleXMLElement) {
			$channel["image"] = (string)$xml->channel->image->url[0];
		} else {
			$channel["image"] = $xml->channel->image->url;
		}
	}

	return $channel;
}

function parseItems($xml) {
	$entries = array();

	foreach ($xml->channel->item as $item) {
		$entry = array("id" => "-1", "title" => "", "description" => "", "guid" => "", "link" => "", "date" => date('Y-m-d H:i:s'));			
		
		if ($item->title instanceof \SimpleXMLElement) {
			$entry["title"] = (string)$item->title[0];						
		} else {
			$entry["title"] = $item->title;
		}
		
		if ($item->description instanceof \SimpleXMLElement) {
			$entry["description"] = (string)$item->description[0];
		} else {
			$entry["description"] = $item->description;
		}

		if ($item->guid instanceof \SimpleXMLElement) {
			$entry["guid"] = (string)$item->guid[0];
		} else {
			$entry["guid"] = $item->guid;
		}
		
		if ($item->link instanceof \SimpleXMLElement) {
			$entry["link"] = (string)$item->link[0];
		} else {
			$entry["link "]= $item->link;
		}

		$dateStr = "";

		if ($item->pubDate instanceof \SimpleXMLElement) {
			$dateStr = (string)$item->pubDate[0];
		} else {
			$dateStr = $item->pubDate;
		}

		$dateArray = date_parse($dateStr);
		$entry["date"] = date('Y-m-d H:i:s', mktime($dateArray['hour'], $dateArray['minute'], $dateArray['second'], $dateArray['month'], $dateArray['day'], $dateArray['year']));
		
		$entries[] = $entry;
	}

	return $entries;
}

?>