const settings = require('../settings');

module.exports.log = function(...args) {
    if (settings.debug) {
        console.log(...args);
    }
}