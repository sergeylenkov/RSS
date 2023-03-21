const args = require('minimist')(process.argv.slice(2));

module.exports = {
    debug: !!args.debug,
    db: args.db,
    port: args.p ? args.p : '5010'
}