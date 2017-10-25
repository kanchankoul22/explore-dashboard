'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hurdle = mongoose.model('Hurdle'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  hurdle;

/**
 * Hurdle routes tests
 */
describe('Hurdle CRUD tests', function () {

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

    // Save a user to the test db and create new Hurdle
    user.save(function () {
      hurdle = {
        name: 'Hurdle name'
      };

      done();
    });
  });

  it('should be able to save a Hurdle if logged in', function (done) {
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

        // Save a new Hurdle
        agent.post('/api/hurdles')
          .send(hurdle)
          .expect(200)
          .end(function (hurdleSaveErr, hurdleSaveRes) {
            // Handle Hurdle save error
            if (hurdleSaveErr) {
              return done(hurdleSaveErr);
            }

            // Get a list of Hurdles
            agent.get('/api/hurdles')
              .end(function (hurdlesGetErr, hurdlesGetRes) {
                // Handle Hurdles save error
                if (hurdlesGetErr) {
                  return done(hurdlesGetErr);
                }

                // Get Hurdles list
                var hurdles = hurdlesGetRes.body;

                // Set assertions
                (hurdles[0].user._id).should.equal(userId);
                (hurdles[0].name).should.match('Hurdle name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Hurdle if not logged in', function (done) {
    agent.post('/api/hurdles')
      .send(hurdle)
      .expect(403)
      .end(function (hurdleSaveErr, hurdleSaveRes) {
        // Call the assertion callback
        done(hurdleSaveErr);
      });
  });

  it('should not be able to save an Hurdle if no name is provided', function (done) {
    // Invalidate name field
    hurdle.name = '';

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

        // Save a new Hurdle
        agent.post('/api/hurdles')
          .send(hurdle)
          .expect(400)
          .end(function (hurdleSaveErr, hurdleSaveRes) {
            // Set message assertion
            (hurdleSaveRes.body.message).should.match('Please fill Hurdle name');

            // Handle Hurdle save error
            done(hurdleSaveErr);
          });
      });
  });

  it('should be able to update an Hurdle if signed in', function (done) {
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

        // Save a new Hurdle
        agent.post('/api/hurdles')
          .send(hurdle)
          .expect(200)
          .end(function (hurdleSaveErr, hurdleSaveRes) {
            // Handle Hurdle save error
            if (hurdleSaveErr) {
              return done(hurdleSaveErr);
            }

            // Update Hurdle name
            hurdle.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Hurdle
            agent.put('/api/hurdles/' + hurdleSaveRes.body._id)
              .send(hurdle)
              .expect(200)
              .end(function (hurdleUpdateErr, hurdleUpdateRes) {
                // Handle Hurdle update error
                if (hurdleUpdateErr) {
                  return done(hurdleUpdateErr);
                }

                // Set assertions
                (hurdleUpdateRes.body._id).should.equal(hurdleSaveRes.body._id);
                (hurdleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Hurdles if not signed in', function (done) {
    // Create new Hurdle model instance
    var hurdleObj = new Hurdle(hurdle);

    // Save the hurdle
    hurdleObj.save(function () {
      // Request Hurdles
      request(app).get('/api/hurdles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Hurdle if not signed in', function (done) {
    // Create new Hurdle model instance
    var hurdleObj = new Hurdle(hurdle);

    // Save the Hurdle
    hurdleObj.save(function () {
      request(app).get('/api/hurdles/' + hurdleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', hurdle.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Hurdle with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hurdles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hurdle is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Hurdle which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Hurdle
    request(app).get('/api/hurdles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Hurdle with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Hurdle if signed in', function (done) {
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

        // Save a new Hurdle
        agent.post('/api/hurdles')
          .send(hurdle)
          .expect(200)
          .end(function (hurdleSaveErr, hurdleSaveRes) {
            // Handle Hurdle save error
            if (hurdleSaveErr) {
              return done(hurdleSaveErr);
            }

            // Delete an existing Hurdle
            agent.delete('/api/hurdles/' + hurdleSaveRes.body._id)
              .send(hurdle)
              .expect(200)
              .end(function (hurdleDeleteErr, hurdleDeleteRes) {
                // Handle hurdle error error
                if (hurdleDeleteErr) {
                  return done(hurdleDeleteErr);
                }

                // Set assertions
                (hurdleDeleteRes.body._id).should.equal(hurdleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Hurdle if not signed in', function (done) {
    // Set Hurdle user
    hurdle.user = user;

    // Create new Hurdle model instance
    var hurdleObj = new Hurdle(hurdle);

    // Save the Hurdle
    hurdleObj.save(function () {
      // Try deleting Hurdle
      request(app).delete('/api/hurdles/' + hurdleObj._id)
        .expect(403)
        .end(function (hurdleDeleteErr, hurdleDeleteRes) {
          // Set message assertion
          (hurdleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Hurdle error error
          done(hurdleDeleteErr);
        });

    });
  });

  it('should be able to get a single Hurdle that has an orphaned user reference', function (done) {
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

          // Save a new Hurdle
          agent.post('/api/hurdles')
            .send(hurdle)
            .expect(200)
            .end(function (hurdleSaveErr, hurdleSaveRes) {
              // Handle Hurdle save error
              if (hurdleSaveErr) {
                return done(hurdleSaveErr);
              }

              // Set assertions on new Hurdle
              (hurdleSaveRes.body.name).should.equal(hurdle.name);
              should.exist(hurdleSaveRes.body.user);
              should.equal(hurdleSaveRes.body.user._id, orphanId);

              // force the Hurdle to have an orphaned user reference
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

                    // Get the Hurdle
                    agent.get('/api/hurdles/' + hurdleSaveRes.body._id)
                      .expect(200)
                      .end(function (hurdleInfoErr, hurdleInfoRes) {
                        // Handle Hurdle error
                        if (hurdleInfoErr) {
                          return done(hurdleInfoErr);
                        }

                        // Set assertions
                        (hurdleInfoRes.body._id).should.equal(hurdleSaveRes.body._id);
                        (hurdleInfoRes.body.name).should.equal(hurdle.name);
                        should.equal(hurdleInfoRes.body.user, undefined);

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
      Hurdle.remove().exec(done);
    });
  });
});
