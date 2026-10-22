const args = require("minimist")(process.argv.slice(2));

const settings = {
  debug: !!args.debug || !!process.env.RSS_DEBUG,
  // Environment variables win over CLI flags so tests and containers can
  // override the defaults without touching the start script.
  db: process.env.RSS_DB || args.db || "db/database.sqlite",
  port: process.env.RSS_PORT || args.p || "5010",
};

module.exports = settings;

