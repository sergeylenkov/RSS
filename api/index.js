var express = require("express");
var app = express();

app.get("/feeds", (req, res, next) => {
    res.json([]);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});