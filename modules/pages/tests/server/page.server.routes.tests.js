'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Page = mongoose.model('Page'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, page;

/**
 * Page routes tests
 */
describe('Page CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new page
    user.save(function () {
      page = {
        url: 'http://www.google.com',
        note: 'Page Note'
      };

      done();
    });
  });

  it('should be able to save a page if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new page
        agent.post('/api/pages')
          .send(page)
          .expect(200)
          .end(function (pageSaveErr, pageSaveRes) {
            // Handle page save error
            if (pageSaveErr) {
              return done(pageSaveErr);
            }

            // Get a list of pages
            agent.get('/api/pages')
              .end(function (pagesGetErr, pagesGetRes) {
                // Handle page save error
                if (pagesGetErr) {
                  return done(pagesGetErr);
                }

                // Get pages list
                var pages = pagesGetRes.body;

                // Set assertions
                (pages[0].user._id).should.equal(userId);
                (pages[0].url).should.match('http://www.google.com');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save a page if not logged in', function (done) {
    agent.post('/api/pages')
      .send(page)
      .expect(403)
      .end(function (pageSaveErr, pageSaveRes) {
        // Call the assertion callback
        done(pageSaveErr);
      });
  });

  it('should not be able to save a page if no url is provided', function (done) {
    // Invalidate url field
    page.url = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new page
        agent.post('/api/pages')
          .send(page)
          .expect(400)
          .end(function (pageSaveErr, pageSaveRes) {
            // Set message assertion
            (pageSaveRes.body.message).should.match('Url cannot be blank');

            // Handle page save error
            done(pageSaveErr);
          });
      });
  });

  it('should be able to update a page if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new page
        agent.post('/api/pages')
          .send(page)
          .expect(200)
          .end(function (pageSaveErr, pageSaveRes) {
            // Handle page save error
            if (pageSaveErr) {
              return done(pageSaveErr);
            }

            // Update page url
            page.url = 'http://reddit.com';

            // Update an existing page
            agent.put('/api/pages/' + pageSaveRes.body._id)
              .send(page)
              .expect(200)
              .end(function (pageUpdateErr, pageUpdateRes) {
                // Handle page update error
                if (pageUpdateErr) {
                  return done(pageUpdateErr);
                }

                // Set assertions
                (pageUpdateRes.body._id).should.equal(pageSaveRes.body._id);
                (pageUpdateRes.body.url).should.match('http://reddit.com');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of pages if not signed in', function (done) {
    // Create new page model instance
    var pageObj = new Page(page);

    // Save the page
    pageObj.save(function () {
      // Request pages
      request(app).get('/api/pages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single page if not signed in', function (done) {
    // Create new page model instance
    var pageObj = new Page(page);

    // Save the page
    pageObj.save(function () {
      request(app).get('/api/pages/' + pageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('url', page.url);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single page with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Page is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single page which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent page
    request(app).get('/api/pages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No page with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an page if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new page
        agent.post('/api/pages')
          .send(page)
          .expect(200)
          .end(function (pageSaveErr, pageSaveRes) {
            // Handle page save error
            if (pageSaveErr) {
              return done(pageSaveErr);
            }

            // Delete an existing page
            agent.delete('/api/pages/' + pageSaveRes.body._id)
              .send(page)
              .expect(200)
              .end(function (pageDeleteErr, pageDeleteRes) {
                // Handle page error error
                if (pageDeleteErr) {
                  return done(pageDeleteErr);
                }

                // Set assertions
                (pageDeleteRes.body._id).should.equal(pageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an page if not signed in', function (done) {
    // Set page user
    page.user = user;

    // Create new page model instance
    var pageObj = new Page(page);

    // Save the page
    pageObj.save(function () {
      // Try deleting page
      request(app).delete('/api/pages/' + pageObj._id)
        .expect(403)
        .end(function (pageDeleteErr, pageDeleteRes) {
          // Set message assertion
          (pageDeleteRes.body.message).should.match('User is not authorized');

          // Handle page error error
          done(pageDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Page.remove().exec(done);
    });
  });
});
