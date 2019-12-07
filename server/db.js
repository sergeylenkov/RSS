const sqlite3 = require('sqlite3').verbose();

let name = 'database.sqlite';

if (process.env.API_TEST) {
    name = 'test/test.sqlite';
}

const db = new sqlite3.Database(name);

module.exports = db;