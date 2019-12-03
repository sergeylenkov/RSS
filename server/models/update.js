const db = require('../db');
const https = require('https');
const xml2js = require('xml2js');

module.exports.updateFeeds = function() {
    return new Promise((resolve, reject) => {
        let items = [];

        https.get('https://tsdrapi.uspto.gov/ts/cd/casestatus/sn78787878/info.xml', function(response) {
            let responseData = '';

            response.setEncoding('utf8');

            response.on('data', function(chunk) {
                responseData += chunk;
            });

            response.on('end', function() {
                //console.log(responseData);
                const parser = new xml2js.Parser();
                parser.parseString(responseData, function(error, result) {
                    console.log(result, error);
                    resolve(items);
                });
            });

            response.on('error', function(error) {
                console.log('Got error: ' + error.message);
                reject(error);
            });
        });
    });
}