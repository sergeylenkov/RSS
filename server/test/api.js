const assert = require('assert');
const request = require('supertest');
const app = require('../index');

describe('GET /feeds', function() {
    it('should get all feeds', (done) => {
    	request(app).get('/feeds')
        .expect(200)
        .end((err, res) => {
        	assert( res.body.items.length > 0, 'must be more then 0');
          	done();
        });
    });
});

describe('GET /entries', function() {
    it('should get all entries', (done) => {
    	request(app).get('/entries')
        .expect(200)
        .end((err, res) => {
        	assert( res.body.items.length > 0, 'must be more then 0');
          	done();
        });
    });
});

describe('GET /entries/unviewed', function() {
    it('should get unviewed entries', (done) => {
    	request(app).get('/entries/unviewed')
        .expect(200)
        .end((err, res) => {
        	assert( res.body.items.length > 0, 'must be more then 0');
          	done();
        });
    });
});

describe('GET /feeds/update', function() {
    this.timeout(0);

    it('should update feeds', (done) => {
    	request(app).get('/feeds/update')
        .expect(200)
        .end((err, res) => {
        	assert( res.body.items.length > 0, 'must be more then 0');
          	done();
        });
    });
});