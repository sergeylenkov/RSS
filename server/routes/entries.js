const express = require('express');
const data = require('../models/entries');

let router = express.Router();

router.get('/', function(req, res) {
    data.all().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.get('/unviewed', function(req, res) {
    data.unviewed().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.post('/viewed', function(req, res) {
    const ids = req.body.ids;

    data.setViewed(ids).then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

module.exports = router;