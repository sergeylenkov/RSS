const sqlite3 = require('sqlite3').verbose();
const args = require('minimist')(process.argv.slice(2));

let name = 'db/database.sqlite';

if (args.db === 'test') {
    name = 'test/test.sqlite';
}

const db = new sqlite3.Database(name);

module.exports = db;