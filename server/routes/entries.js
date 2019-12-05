const express = require('express');
const data = require('../models/entries');

let router = express.Router();

router.get('/', (req, res) => {
    data.all().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

router.get('/unviewed', (req, res) => {
    data.unviewed().then((items) => {
        return res.json(items);
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

module.exports = router;