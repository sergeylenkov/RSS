<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$db = new PDO("sqlite:database.sqlite");

$statement = $db->prepare("CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, guid TEXT, link TEXT, title TEXT, description TEXT, date TEXT)");
$statement->execute();

$feeds = array(
			"https://habrahabr.ru/rss/all/",
			"https://ilyabirman.ru/meanwhile/rss",
            //"http://www.reddit.com/r/programming/.rss"
        );
		
if ($_GET["action"] == "new") {
	$channels = array();
	$entries = array();
	
	foreach($feeds as $feed) {
		$xml = simplexml_load_file($feed);
		//$entries = $xml;//array_merge($entries, $xml->xpath("//item"));
		//echo var_dump($xml->channel->title);
		$channel = (string)$xml->channel->title[0];
		$count = 0;

		foreach($xml->channel->item as $entry) {			
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
			
			$result = $db->query("SELECT guid FROM entries WHERE guid = '" . $guid . "'")->fetch();

            if (empty($result)) {
            	$statement = $db->prepare("INSERT INTO entries (guid, link, title, description, date) VALUES (?, ?, ?, ?, ?)");
				$statement->execute(array($guid, $link, $title, $description, $date));

				$entries[] = array("channel" => $channel, "title" => $title, "description" => $description, "guid" => $guid, "link" => $link, "date" => $date);
				$count++;
			}
		}

		$channels[] = array("title" => $channel, "count" => $count);
	}
	
	echo json_encode(array("channels" => $channels, "entries" => $entries));
}

?>