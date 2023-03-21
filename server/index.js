const express = require('express');
const bodyParser = require('body-parser');
const feeds = require('./routes/feeds');
const entries = require('./routes/entries');
const settings = require('./settings');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });

app.use(bodyParser.json());

app.use('/feeds', feeds);
app.use('/entries', entries);

app.listen(settings.port);

console.log('App is listening on port ' + settings.port);

module.exports = app;
