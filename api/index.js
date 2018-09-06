var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var app = express();

//app.use(express.static(path.join(__dirname, 'public')));

var db = new sqlite3.Database('../database.sqlite', (err) => {
    console.log(err);
});

app.get('/feeds', (req, res, next) => {
    db.all('SELECT * FROM feeds', [], (err, rows) => {
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});