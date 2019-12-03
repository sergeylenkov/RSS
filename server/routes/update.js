const express = require('express');
const data = require('../models/update');

let router = express.Router();

router.get('/', (req, res) => {
    data.updateFeeds().then((items) => {
        return res.json({ items: items });
    }).catch((error) => {
        res.status(500).send({ error: error });
    });
});

module.exports = router;