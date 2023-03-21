const sqlite3 = require('sqlite3').verbose();
const settings = require('./settings');
const utils = require('./utils/index');
console.log(settings);
const db = new sqlite3.Database(settings.db);
utils.log(`Database open ${settings.db}`);
module.exports = db;