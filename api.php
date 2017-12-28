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

if ($_GET["action"] == "new") {
	$channels = getFeeds();
	$items = array();
	
	foreach ($channels as $channel) {	
		$xml = simplexml_load_file($channel["rss"]);
		$channelItems = parseItems($xml);
		$newItems = array();

		foreach ($channelItems as $item) {
			if (addEntry($channel["id"], $item)) {
				$newItems[] = $item;
			}
		}

		$items = array_merge($items, $newItems);

		$channel["count"] = count($newItems);
	}
	
	echo json_encode(array("channels" => $channels, "entries" => $items));
}

if ($_GET["action"] == "feed_add") {
	$link = $_GET["link"];
	addFeed($link);	
}

function getFeeds() {
	global $db;
	$channels = array();

	foreach ($db->query("SELECT * FROM feeds") as $row) {
		$channels[] = array("id" => $row["id"], "rss" => $row["rss"], "link" => $row["link"], "title" => $row["title"], "description" => $row["description"], "count" => 0);
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

		if ($statement->execute(array($channel["rss"], $channel["link"], $channel["title"], $channel["description"], $channel["image"], $channel["active"], $channel["status"], $channel["date"], false))) {
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

function addEntry($feed, $entry) {
	global $db;

	$result = $db->query("SELECT guid FROM entries WHERE feed_id = " . $feed . " AND guid = '" . $entry["guid"] . "'")->fetch();

	if (empty($result)) {
		$statement = $db->prepare("INSERT INTO entries (feed_id, guid, link, title, description, read, viewed, favorite, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
		$statement->execute(array($feed, $entry["guid"], $entry["link"], $entry["title"], $entry["description"], false, false, false, $entry["date"]));

		return true;
	}

	return false;
}

function parseChannel($xml) {
	$channel = array("id" => -1, "rss" => "", "link" => "", "title" => "", "description" => "", "active" => true, "status" => "ok", "image" => "", "date" => date('Y-m-d H:i:s'));

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

	foreach ($xml->channel->item as $entry) {			
		$title = "";
		$description = "";
		$guid = "";
		$link = "";
		$dateStr = "";
		//echo var_dump($entry);
		
		if ($entry->title instanceof \SimpleXMLElement) {
			$title = (string)$entry->title[0];				
			//echo var_dump((string)$entry->title[0]);
		} else {
			$title = $entry->title;
		}
		
		if ($entry->description instanceof \SimpleXMLElement) {
			$description = (string)$entry->description[0];
			//echo var_dump((string)$entry->description[0]);
		} else {
			$description = $entry->description;
		}

		if ($entry->guid instanceof \SimpleXMLElement) {
			$guid = (string)$entry->guid[0];
		} else {
			$guid = $entry->guid;
		}
		
		if ($entry->link instanceof \SimpleXMLElement) {
			$link = (string)$entry->link[0];
		} else {
			$link = $entry->link;
		}

		if ($entry->pubDate instanceof \SimpleXMLElement) {
			$dateStr = (string)$entry->pubDate[0];
		} else {
			$dateStr = $entry->pubDate;
		}

		$dateArray = date_parse($dateStr);
		$date = date('Y-m-d H:i:s', mktime($dateArray['hour'], $dateArray['minute'], $dateArray['second'], $dateArray['month'], $dateArray['day'], $dateArray['year']));
		
		$entries[] = array("title" => $title, "description" => $description, "guid" => $guid, "link" => $link, "date" => $date);
	}

	return $entries;
}

?>