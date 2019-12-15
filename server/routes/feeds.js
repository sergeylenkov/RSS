const express = require('express');
const feeds = require('../models/feeds');

let router = express.Router();

router.get('/', function(req, res) {
    feeds.all().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.get('/update', function(req, res) {
    feeds.update().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.post('/', function(req, res) {
    const link = req.body.link;

    feeds.add(link).then((feed) => {
        return res.json(feed);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

module.exports = router;