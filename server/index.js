const express = require('express');
const bodyParser = require('body-parser');
const feeds = require('./routes/feeds');
const entries = require('./routes/entries');

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

const args = require('minimist')(process.argv.slice(2));
let port = 5000;

if (args.p) {
    port = args.p;
}

app.listen(port);

console.log('App is listening on port ' + port);

module.exports = app;
