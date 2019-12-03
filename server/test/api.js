const assert = require('assert');
const request = require('supertest');
const app = require('../index');

describe('GET /update', () => {
    it('should update feeds', (done) => {
    	request(app).get('/update')
        .expect(200)
        .end(function(err, res) {
        	assert( res.body.items.length > 0, 'must be more then 0');
          	done();
        });
    });
});
