'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Title = mongoose.model('Title'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  title;

/**
 * Title routes tests
 */
describe('Title CRUD tests', function () {

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
      password: 'M3@n.jsI$Aw3$0m3'
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

    // Save a user to the test db and create new Title
    user.save(function () {
      title = {
        name: 'Title name'
      };

      done();
    });
  });

  it('should be able to save a Title if logged in', function (done) {
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

        // Save a new Title
        agent.post('/api/titles')
          .send(title)
          .expect(200)
          .end(function (titleSaveErr, titleSaveRes) {
            // Handle Title save error
            if (titleSaveErr) {
              return done(titleSaveErr);
            }

            // Get a list of Titles
            agent.get('/api/titles')
              .end(function (titlesGetErr, titlesGetRes) {
                // Handle Titles save error
                if (titlesGetErr) {
                  return done(titlesGetErr);
                }

                // Get Titles list
                var titles = titlesGetRes.body;

                // Set assertions
                (titles[0].user._id).should.equal(userId);
                (titles[0].name).should.match('Title name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Title if not logged in', function (done) {
    agent.post('/api/titles')
      .send(title)
      .expect(403)
      .end(function (titleSaveErr, titleSaveRes) {
        // Call the assertion callback
        done(titleSaveErr);
      });
  });

  it('should not be able to save an Title if no name is provided', function (done) {
    // Invalidate name field
    title.name = '';

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

        // Save a new Title
        agent.post('/api/titles')
          .send(title)
          .expect(400)
          .end(function (titleSaveErr, titleSaveRes) {
            // Set message assertion
            (titleSaveRes.body.message).should.match('Please fill Title name');

            // Handle Title save error
            done(titleSaveErr);
          });
      });
  });

  it('should be able to update an Title if signed in', function (done) {
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

        // Save a new Title
        agent.post('/api/titles')
          .send(title)
          .expect(200)
          .end(function (titleSaveErr, titleSaveRes) {
            // Handle Title save error
            if (titleSaveErr) {
              return done(titleSaveErr);
            }

            // Update Title name
            title.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Title
            agent.put('/api/titles/' + titleSaveRes.body._id)
              .send(title)
              .expect(200)
              .end(function (titleUpdateErr, titleUpdateRes) {
                // Handle Title update error
                if (titleUpdateErr) {
                  return done(titleUpdateErr);
                }

                // Set assertions
                (titleUpdateRes.body._id).should.equal(titleSaveRes.body._id);
                (titleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Titles if not signed in', function (done) {
    // Create new Title model instance
    var titleObj = new Title(title);

    // Save the title
    titleObj.save(function () {
      // Request Titles
      request(app).get('/api/titles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Title if not signed in', function (done) {
    // Create new Title model instance
    var titleObj = new Title(title);

    // Save the Title
    titleObj.save(function () {
      request(app).get('/api/titles/' + titleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', title.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Title with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/titles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Title is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Title which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Title
    request(app).get('/api/titles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Title with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Title if signed in', function (done) {
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

        // Save a new Title
        agent.post('/api/titles')
          .send(title)
          .expect(200)
          .end(function (titleSaveErr, titleSaveRes) {
            // Handle Title save error
            if (titleSaveErr) {
              return done(titleSaveErr);
            }

            // Delete an existing Title
            agent.delete('/api/titles/' + titleSaveRes.body._id)
              .send(title)
              .expect(200)
              .end(function (titleDeleteErr, titleDeleteRes) {
                // Handle title error error
                if (titleDeleteErr) {
                  return done(titleDeleteErr);
                }

                // Set assertions
                (titleDeleteRes.body._id).should.equal(titleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Title if not signed in', function (done) {
    // Set Title user
    title.user = user;

    // Create new Title model instance
    var titleObj = new Title(title);

    // Save the Title
    titleObj.save(function () {
      // Try deleting Title
      request(app).delete('/api/titles/' + titleObj._id)
        .expect(403)
        .end(function (titleDeleteErr, titleDeleteRes) {
          // Set message assertion
          (titleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Title error error
          done(titleDeleteErr);
        });

    });
  });

  it('should be able to get a single Title that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Title
          agent.post('/api/titles')
            .send(title)
            .expect(200)
            .end(function (titleSaveErr, titleSaveRes) {
              // Handle Title save error
              if (titleSaveErr) {
                return done(titleSaveErr);
              }

              // Set assertions on new Title
              (titleSaveRes.body.name).should.equal(title.name);
              should.exist(titleSaveRes.body.user);
              should.equal(titleSaveRes.body.user._id, orphanId);

              // force the Title to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Title
                    agent.get('/api/titles/' + titleSaveRes.body._id)
                      .expect(200)
                      .end(function (titleInfoErr, titleInfoRes) {
                        // Handle Title error
                        if (titleInfoErr) {
                          return done(titleInfoErr);
                        }

                        // Set assertions
                        (titleInfoRes.body._id).should.equal(titleSaveRes.body._id);
                        (titleInfoRes.body.name).should.equal(title.name);
                        should.equal(titleInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Title.remove().exec(done);
    });
  });
});
