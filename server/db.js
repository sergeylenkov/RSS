const sqlite3 = require('sqlite3').verbose();
const settings = require('./settings');

const db = new sqlite3.Database(settings.db);

module.exports = db;