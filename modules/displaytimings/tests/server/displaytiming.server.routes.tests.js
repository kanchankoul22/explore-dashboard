'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Displaytiming = mongoose.model('Displaytiming'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  displaytiming;

/**
 * Displaytiming routes tests
 */
describe('Displaytiming CRUD tests', function () {

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

    // Save a user to the test db and create new Displaytiming
    user.save(function () {
      displaytiming = {
        name: 'Displaytiming name'
      };

      done();
    });
  });

  it('should be able to save a Displaytiming if logged in', function (done) {
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

        // Save a new Displaytiming
        agent.post('/api/displaytimings')
          .send(displaytiming)
          .expect(200)
          .end(function (displaytimingSaveErr, displaytimingSaveRes) {
            // Handle Displaytiming save error
            if (displaytimingSaveErr) {
              return done(displaytimingSaveErr);
            }

            // Get a list of Displaytimings
            agent.get('/api/displaytimings')
              .end(function (displaytimingsGetErr, displaytimingsGetRes) {
                // Handle Displaytimings save error
                if (displaytimingsGetErr) {
                  return done(displaytimingsGetErr);
                }

                // Get Displaytimings list
                var displaytimings = displaytimingsGetRes.body;

                // Set assertions
                (displaytimings[0].user._id).should.equal(userId);
                (displaytimings[0].name).should.match('Displaytiming name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Displaytiming if not logged in', function (done) {
    agent.post('/api/displaytimings')
      .send(displaytiming)
      .expect(403)
      .end(function (displaytimingSaveErr, displaytimingSaveRes) {
        // Call the assertion callback
        done(displaytimingSaveErr);
      });
  });

  it('should not be able to save an Displaytiming if no name is provided', function (done) {
    // Invalidate name field
    displaytiming.name = '';

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

        // Save a new Displaytiming
        agent.post('/api/displaytimings')
          .send(displaytiming)
          .expect(400)
          .end(function (displaytimingSaveErr, displaytimingSaveRes) {
            // Set message assertion
            (displaytimingSaveRes.body.message).should.match('Please fill Displaytiming name');

            // Handle Displaytiming save error
            done(displaytimingSaveErr);
          });
      });
  });

  it('should be able to update an Displaytiming if signed in', function (done) {
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

        // Save a new Displaytiming
        agent.post('/api/displaytimings')
          .send(displaytiming)
          .expect(200)
          .end(function (displaytimingSaveErr, displaytimingSaveRes) {
            // Handle Displaytiming save error
            if (displaytimingSaveErr) {
              return done(displaytimingSaveErr);
            }

            // Update Displaytiming name
            displaytiming.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Displaytiming
            agent.put('/api/displaytimings/' + displaytimingSaveRes.body._id)
              .send(displaytiming)
              .expect(200)
              .end(function (displaytimingUpdateErr, displaytimingUpdateRes) {
                // Handle Displaytiming update error
                if (displaytimingUpdateErr) {
                  return done(displaytimingUpdateErr);
                }

                // Set assertions
                (displaytimingUpdateRes.body._id).should.equal(displaytimingSaveRes.body._id);
                (displaytimingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Displaytimings if not signed in', function (done) {
    // Create new Displaytiming model instance
    var displaytimingObj = new Displaytiming(displaytiming);

    // Save the displaytiming
    displaytimingObj.save(function () {
      // Request Displaytimings
      request(app).get('/api/displaytimings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Displaytiming if not signed in', function (done) {
    // Create new Displaytiming model instance
    var displaytimingObj = new Displaytiming(displaytiming);

    // Save the Displaytiming
    displaytimingObj.save(function () {
      request(app).get('/api/displaytimings/' + displaytimingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', displaytiming.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Displaytiming with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/displaytimings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Displaytiming is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Displaytiming which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Displaytiming
    request(app).get('/api/displaytimings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Displaytiming with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Displaytiming if signed in', function (done) {
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

        // Save a new Displaytiming
        agent.post('/api/displaytimings')
          .send(displaytiming)
          .expect(200)
          .end(function (displaytimingSaveErr, displaytimingSaveRes) {
            // Handle Displaytiming save error
            if (displaytimingSaveErr) {
              return done(displaytimingSaveErr);
            }

            // Delete an existing Displaytiming
            agent.delete('/api/displaytimings/' + displaytimingSaveRes.body._id)
              .send(displaytiming)
              .expect(200)
              .end(function (displaytimingDeleteErr, displaytimingDeleteRes) {
                // Handle displaytiming error error
                if (displaytimingDeleteErr) {
                  return done(displaytimingDeleteErr);
                }

                // Set assertions
                (displaytimingDeleteRes.body._id).should.equal(displaytimingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Displaytiming if not signed in', function (done) {
    // Set Displaytiming user
    displaytiming.user = user;

    // Create new Displaytiming model instance
    var displaytimingObj = new Displaytiming(displaytiming);

    // Save the Displaytiming
    displaytimingObj.save(function () {
      // Try deleting Displaytiming
      request(app).delete('/api/displaytimings/' + displaytimingObj._id)
        .expect(403)
        .end(function (displaytimingDeleteErr, displaytimingDeleteRes) {
          // Set message assertion
          (displaytimingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Displaytiming error error
          done(displaytimingDeleteErr);
        });

    });
  });

  it('should be able to get a single Displaytiming that has an orphaned user reference', function (done) {
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

          // Save a new Displaytiming
          agent.post('/api/displaytimings')
            .send(displaytiming)
            .expect(200)
            .end(function (displaytimingSaveErr, displaytimingSaveRes) {
              // Handle Displaytiming save error
              if (displaytimingSaveErr) {
                return done(displaytimingSaveErr);
              }

              // Set assertions on new Displaytiming
              (displaytimingSaveRes.body.name).should.equal(displaytiming.name);
              should.exist(displaytimingSaveRes.body.user);
              should.equal(displaytimingSaveRes.body.user._id, orphanId);

              // force the Displaytiming to have an orphaned user reference
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

                    // Get the Displaytiming
                    agent.get('/api/displaytimings/' + displaytimingSaveRes.body._id)
                      .expect(200)
                      .end(function (displaytimingInfoErr, displaytimingInfoRes) {
                        // Handle Displaytiming error
                        if (displaytimingInfoErr) {
                          return done(displaytimingInfoErr);
                        }

                        // Set assertions
                        (displaytimingInfoRes.body._id).should.equal(displaytimingSaveRes.body._id);
                        (displaytimingInfoRes.body.name).should.equal(displaytiming.name);
                        should.equal(displaytimingInfoRes.body.user, undefined);

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
      Displaytiming.remove().exec(done);
    });
  });
});
