const assert = require('assert');
const request = require('supertest');
const app = require('../index');

describe('GET /feeds', function() {
  it('should get all feeds', (done) => {
    request(app).get('/feeds')
      .expect(200)
      .end((err, res) => {
        assert(res.body.length > 0, 'must be more then 0');
        done();
      });
  });
});

describe('GET /entries', function() {
  it('should get all entries', (done) => {
    request(app).get('/entries')
      .expect(200)
      .end((err, res) => {
        assert(res.body.length > 0, 'must be more then 0');
        done();
      });
  });
});

describe('GET /entries/unviewed', function() {
  it('should get unviewed entries', (done) => {
    request(app).get('/entries/unviewed')
      .expect(200)
      .end((err, res) => {
        assert(res.body.length > 0, 'must be more then 0');
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
        assert(res.body.length > 0, 'must be more then 0');
        done();
      });
  });
});

describe('PUT /entries/1/favorite', function() {
  it('should set entry as favorite', (done) => {
    request(app).put('/entries/1/favorite')
      .expect(200)
      .end((err, res) => {
        assert(parseInt(res.body.id) === 1, 'id must be 1');
        assert(res.body.isFavorite === true, 'must be true');
        done();
      });
  });
});