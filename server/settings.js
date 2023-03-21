const args = require("minimist")(process.argv.slice(2));

const settings = {
  debug: !!args.debug,
  db: args.db,
  port: args.p ? args.p : "5010",
};

module.exports = settings;
