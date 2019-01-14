const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');

describe('loading express', function() {
  var app;

  beforeEach( function() {
    console.log('beforeEach')
    app = require('../app');
  });
  afterEach( function() {
    app.close();
  });
  it('responses to /', function testIndex(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
  it('404 Everything else', function testPath(done) {
    request(app)
      .get('/foo/bar')
      .expect(404, done);
  });
});