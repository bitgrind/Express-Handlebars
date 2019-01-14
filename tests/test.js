process.env.NODE_ENV = 'test';

const assert = require('assert');
const expect = require('chai').expect;
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const request = require('supertest');
const passport = require('passport');
const mongoose = require('mongoose');

const app = require('../app');

mongoose.connect('mongodb://localhost/pstvdb');

require('../models/Thread');
const Thread = mongoose.model('thread');

require('../models/User');
const User = mongoose.model('user');

chai.use(chaiHttp);

let req = {body:{title:'title', details:'details'}, user:{_id:'5c3cdb7361edc64f322ac0d1'}};

describe('loading express', function() {

  beforeEach( function() {
    console.log('beforeEach')
  });
  afterEach( function() {
    app.close();
  });

  it('Index Route', function testIndex(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('About Route', function testPath(done) {
    request(app)
      .get('/about')
      .expect(200, done);
  });

  it('Threads Index', function testPath(done) {
    request(app)
      .get('/threads')
      .expect(302, done);
  });

  it('Threads Add', function testPath(done) {
    request(app)
      .get('/threads/add')
      .expect(302, done);
  });

  it('Threads Get Id', function testPath(done) {
    request(app)
      .get('/threads/edit/5c3ba63d09312823e954f62b')
      .expect(302, done);
  });

  it('Post Thread', (done) => {
    let thread = {title:'title', details:'dets'};
    chai.request(app)
      .get('/threads?title=title&details=details')
      .set('Content-Type', 'text/html')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  })
});