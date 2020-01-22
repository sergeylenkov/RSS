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

router.get('/favorites', function(req, res) {
    data.favorites().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.get('/read', function(req, res) {
    data.read().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.post('/view', function(req, res) {
    const ids = req.body.ids;

    data.setViewed(ids).then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.put('/:entryId/read', function(req, res) {
    const id = req.params.entryId;

    data.setRead(id, true).then((item) => {
        return res.json(item);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.delete('/:entryId/read', function(req, res) {
    const id = req.params.entryId;

    data.setRead(id, false).then((item) => {
        return res.json(item);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.put('/:entryId/favorite', function(req, res) {
    const id = req.params.entryId;

    data.setFavorite(id, true).then((item) => {
        return res.json(item);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.delete('/:entryId/favorite', function(req, res) {
    const id = req.params.entryId;

    data.setFavorite(id, false).then((item) => {
        return res.json(item);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.get('/clear/:days', function(req, res) {
    const days = req.params.days;

    data.clear(days).then((item) => {
        return res.json(item);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

module.exports = router;