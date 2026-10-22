const express = require("express");
const bodyParser = require("body-parser");
const feeds = require("./routes/feeds");
const entries = require("./routes/entries");
const settings = require("./settings");
const utils = require("./utils");

function createApp() {
  const app = express();

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(bodyParser.json());

  app.use("/feeds", feeds);
  app.use("/entries", entries);

  return app;
}

const app = createApp();

// Only a direct `node index.js` run opens a port. When the module is required
// (tests, supertest) the app is handed over as is, so nothing is listening.
if (require.main === module) {
  app.listen(settings.port);

  utils.log("App is listening on port " + settings.port);
  utils.log("App settings: ", settings);
}

module.exports = app;
module.exports.createApp = createApp;

