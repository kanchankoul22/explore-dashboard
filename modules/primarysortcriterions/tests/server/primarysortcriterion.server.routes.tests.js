'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Primarysortcriterion = mongoose.model('Primarysortcriterion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  primarysortcriterion;

/**
 * Primarysortcriterion routes tests
 */
describe('Primarysortcriterion CRUD tests', function () {

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

    // Save a user to the test db and create new Primarysortcriterion
    user.save(function () {
      primarysortcriterion = {
        name: 'Primarysortcriterion name'
      };

      done();
    });
  });

  it('should be able to save a Primarysortcriterion if logged in', function (done) {
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

        // Save a new Primarysortcriterion
        agent.post('/api/primarysortcriterions')
          .send(primarysortcriterion)
          .expect(200)
          .end(function (primarysortcriterionSaveErr, primarysortcriterionSaveRes) {
            // Handle Primarysortcriterion save error
            if (primarysortcriterionSaveErr) {
              return done(primarysortcriterionSaveErr);
            }

            // Get a list of Primarysortcriterions
            agent.get('/api/primarysortcriterions')
              .end(function (primarysortcriterionsGetErr, primarysortcriterionsGetRes) {
                // Handle Primarysortcriterions save error
                if (primarysortcriterionsGetErr) {
                  return done(primarysortcriterionsGetErr);
                }

                // Get Primarysortcriterions list
                var primarysortcriterions = primarysortcriterionsGetRes.body;

                // Set assertions
                (primarysortcriterions[0].user._id).should.equal(userId);
                (primarysortcriterions[0].name).should.match('Primarysortcriterion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Primarysortcriterion if not logged in', function (done) {
    agent.post('/api/primarysortcriterions')
      .send(primarysortcriterion)
      .expect(403)
      .end(function (primarysortcriterionSaveErr, primarysortcriterionSaveRes) {
        // Call the assertion callback
        done(primarysortcriterionSaveErr);
      });
  });

  it('should not be able to save an Primarysortcriterion if no name is provided', function (done) {
    // Invalidate name field
    primarysortcriterion.name = '';

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

        // Save a new Primarysortcriterion
        agent.post('/api/primarysortcriterions')
          .send(primarysortcriterion)
          .expect(400)
          .end(function (primarysortcriterionSaveErr, primarysortcriterionSaveRes) {
            // Set message assertion
            (primarysortcriterionSaveRes.body.message).should.match('Please fill Primarysortcriterion name');

            // Handle Primarysortcriterion save error
            done(primarysortcriterionSaveErr);
          });
      });
  });

  it('should be able to update an Primarysortcriterion if signed in', function (done) {
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

        // Save a new Primarysortcriterion
        agent.post('/api/primarysortcriterions')
          .send(primarysortcriterion)
          .expect(200)
          .end(function (primarysortcriterionSaveErr, primarysortcriterionSaveRes) {
            // Handle Primarysortcriterion save error
            if (primarysortcriterionSaveErr) {
              return done(primarysortcriterionSaveErr);
            }

            // Update Primarysortcriterion name
            primarysortcriterion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Primarysortcriterion
            agent.put('/api/primarysortcriterions/' + primarysortcriterionSaveRes.body._id)
              .send(primarysortcriterion)
              .expect(200)
              .end(function (primarysortcriterionUpdateErr, primarysortcriterionUpdateRes) {
                // Handle Primarysortcriterion update error
                if (primarysortcriterionUpdateErr) {
                  return done(primarysortcriterionUpdateErr);
                }

                // Set assertions
                (primarysortcriterionUpdateRes.body._id).should.equal(primarysortcriterionSaveRes.body._id);
                (primarysortcriterionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Primarysortcriterions if not signed in', function (done) {
    // Create new Primarysortcriterion model instance
    var primarysortcriterionObj = new Primarysortcriterion(primarysortcriterion);

    // Save the primarysortcriterion
    primarysortcriterionObj.save(function () {
      // Request Primarysortcriterions
      request(app).get('/api/primarysortcriterions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Primarysortcriterion if not signed in', function (done) {
    // Create new Primarysortcriterion model instance
    var primarysortcriterionObj = new Primarysortcriterion(primarysortcriterion);

    // Save the Primarysortcriterion
    primarysortcriterionObj.save(function () {
      request(app).get('/api/primarysortcriterions/' + primarysortcriterionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', primarysortcriterion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Primarysortcriterion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/primarysortcriterions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Primarysortcriterion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Primarysortcriterion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Primarysortcriterion
    request(app).get('/api/primarysortcriterions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Primarysortcriterion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Primarysortcriterion if signed in', function (done) {
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

        // Save a new Primarysortcriterion
        agent.post('/api/primarysortcriterions')
          .send(primarysortcriterion)
          .expect(200)
          .end(function (primarysortcriterionSaveErr, primarysortcriterionSaveRes) {
            // Handle Primarysortcriterion save error
            if (primarysortcriterionSaveErr) {
              return done(primarysortcriterionSaveErr);
            }

            // Delete an existing Primarysortcriterion
            agent.delete('/api/primarysortcriterions/' + primarysortcriterionSaveRes.body._id)
              .send(primarysortcriterion)
              .expect(200)
              .end(function (primarysortcriterionDeleteErr, primarysortcriterionDeleteRes) {
                // Handle primarysortcriterion error error
                if (primarysortcriterionDeleteErr) {
                  return done(primarysortcriterionDeleteErr);
                }

                // Set assertions
                (primarysortcriterionDeleteRes.body._id).should.equal(primarysortcriterionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Primarysortcriterion if not signed in', function (done) {
    // Set Primarysortcriterion user
    primarysortcriterion.user = user;

    // Create new Primarysortcriterion model instance
    var primarysortcriterionObj = new Primarysortcriterion(primarysortcriterion);

    // Save the Primarysortcriterion
    primarysortcriterionObj.save(function () {
      // Try deleting Primarysortcriterion
      request(app).delete('/api/primarysortcriterions/' + primarysortcriterionObj._id)
        .expect(403)
        .end(function (primarysortcriterionDeleteErr, primarysortcriterionDeleteRes) {
          // Set message assertion
          (primarysortcriterionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Primarysortcriterion error error
          done(primarysortcriterionDeleteErr);
        });

    });
  });

  it('should be able to get a single Primarysortcriterion that has an orphaned user reference', function (done) {
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

          // Save a new Primarysortcriterion
          agent.post('/api/primarysortcriterions')
            .send(primarysortcriterion)
            .expect(200)
            .end(function (primarysortcriterionSaveErr, primarysortcriterionSaveRes) {
              // Handle Primarysortcriterion save error
              if (primarysortcriterionSaveErr) {
                return done(primarysortcriterionSaveErr);
              }

              // Set assertions on new Primarysortcriterion
              (primarysortcriterionSaveRes.body.name).should.equal(primarysortcriterion.name);
              should.exist(primarysortcriterionSaveRes.body.user);
              should.equal(primarysortcriterionSaveRes.body.user._id, orphanId);

              // force the Primarysortcriterion to have an orphaned user reference
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

                    // Get the Primarysortcriterion
                    agent.get('/api/primarysortcriterions/' + primarysortcriterionSaveRes.body._id)
                      .expect(200)
                      .end(function (primarysortcriterionInfoErr, primarysortcriterionInfoRes) {
                        // Handle Primarysortcriterion error
                        if (primarysortcriterionInfoErr) {
                          return done(primarysortcriterionInfoErr);
                        }

                        // Set assertions
                        (primarysortcriterionInfoRes.body._id).should.equal(primarysortcriterionSaveRes.body._id);
                        (primarysortcriterionInfoRes.body.name).should.equal(primarysortcriterion.name);
                        should.equal(primarysortcriterionInfoRes.body.user, undefined);

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
      Primarysortcriterion.remove().exec(done);
    });
  });
});
