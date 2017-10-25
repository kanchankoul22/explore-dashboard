'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Criterion = mongoose.model('Criterion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  criterion;

/**
 * Criterion routes tests
 */
describe('Criterion CRUD tests', function () {

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

    // Save a user to the test db and create new Criterion
    user.save(function () {
      criterion = {
        name: 'Criterion name'
      };

      done();
    });
  });

  it('should be able to save a Criterion if logged in', function (done) {
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

        // Save a new Criterion
        agent.post('/api/criterions')
          .send(criterion)
          .expect(200)
          .end(function (criterionSaveErr, criterionSaveRes) {
            // Handle Criterion save error
            if (criterionSaveErr) {
              return done(criterionSaveErr);
            }

            // Get a list of Criterions
            agent.get('/api/criterions')
              .end(function (criterionsGetErr, criterionsGetRes) {
                // Handle Criterions save error
                if (criterionsGetErr) {
                  return done(criterionsGetErr);
                }

                // Get Criterions list
                var criterions = criterionsGetRes.body;

                // Set assertions
                (criterions[0].user._id).should.equal(userId);
                (criterions[0].name).should.match('Criterion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Criterion if not logged in', function (done) {
    agent.post('/api/criterions')
      .send(criterion)
      .expect(403)
      .end(function (criterionSaveErr, criterionSaveRes) {
        // Call the assertion callback
        done(criterionSaveErr);
      });
  });

  it('should not be able to save an Criterion if no name is provided', function (done) {
    // Invalidate name field
    criterion.name = '';

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

        // Save a new Criterion
        agent.post('/api/criterions')
          .send(criterion)
          .expect(400)
          .end(function (criterionSaveErr, criterionSaveRes) {
            // Set message assertion
            (criterionSaveRes.body.message).should.match('Please fill Criterion name');

            // Handle Criterion save error
            done(criterionSaveErr);
          });
      });
  });

  it('should be able to update an Criterion if signed in', function (done) {
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

        // Save a new Criterion
        agent.post('/api/criterions')
          .send(criterion)
          .expect(200)
          .end(function (criterionSaveErr, criterionSaveRes) {
            // Handle Criterion save error
            if (criterionSaveErr) {
              return done(criterionSaveErr);
            }

            // Update Criterion name
            criterion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Criterion
            agent.put('/api/criterions/' + criterionSaveRes.body._id)
              .send(criterion)
              .expect(200)
              .end(function (criterionUpdateErr, criterionUpdateRes) {
                // Handle Criterion update error
                if (criterionUpdateErr) {
                  return done(criterionUpdateErr);
                }

                // Set assertions
                (criterionUpdateRes.body._id).should.equal(criterionSaveRes.body._id);
                (criterionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Criterions if not signed in', function (done) {
    // Create new Criterion model instance
    var criterionObj = new Criterion(criterion);

    // Save the criterion
    criterionObj.save(function () {
      // Request Criterions
      request(app).get('/api/criterions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Criterion if not signed in', function (done) {
    // Create new Criterion model instance
    var criterionObj = new Criterion(criterion);

    // Save the Criterion
    criterionObj.save(function () {
      request(app).get('/api/criterions/' + criterionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', criterion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Criterion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/criterions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Criterion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Criterion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Criterion
    request(app).get('/api/criterions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Criterion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Criterion if signed in', function (done) {
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

        // Save a new Criterion
        agent.post('/api/criterions')
          .send(criterion)
          .expect(200)
          .end(function (criterionSaveErr, criterionSaveRes) {
            // Handle Criterion save error
            if (criterionSaveErr) {
              return done(criterionSaveErr);
            }

            // Delete an existing Criterion
            agent.delete('/api/criterions/' + criterionSaveRes.body._id)
              .send(criterion)
              .expect(200)
              .end(function (criterionDeleteErr, criterionDeleteRes) {
                // Handle criterion error error
                if (criterionDeleteErr) {
                  return done(criterionDeleteErr);
                }

                // Set assertions
                (criterionDeleteRes.body._id).should.equal(criterionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Criterion if not signed in', function (done) {
    // Set Criterion user
    criterion.user = user;

    // Create new Criterion model instance
    var criterionObj = new Criterion(criterion);

    // Save the Criterion
    criterionObj.save(function () {
      // Try deleting Criterion
      request(app).delete('/api/criterions/' + criterionObj._id)
        .expect(403)
        .end(function (criterionDeleteErr, criterionDeleteRes) {
          // Set message assertion
          (criterionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Criterion error error
          done(criterionDeleteErr);
        });

    });
  });

  it('should be able to get a single Criterion that has an orphaned user reference', function (done) {
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

          // Save a new Criterion
          agent.post('/api/criterions')
            .send(criterion)
            .expect(200)
            .end(function (criterionSaveErr, criterionSaveRes) {
              // Handle Criterion save error
              if (criterionSaveErr) {
                return done(criterionSaveErr);
              }

              // Set assertions on new Criterion
              (criterionSaveRes.body.name).should.equal(criterion.name);
              should.exist(criterionSaveRes.body.user);
              should.equal(criterionSaveRes.body.user._id, orphanId);

              // force the Criterion to have an orphaned user reference
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

                    // Get the Criterion
                    agent.get('/api/criterions/' + criterionSaveRes.body._id)
                      .expect(200)
                      .end(function (criterionInfoErr, criterionInfoRes) {
                        // Handle Criterion error
                        if (criterionInfoErr) {
                          return done(criterionInfoErr);
                        }

                        // Set assertions
                        (criterionInfoRes.body._id).should.equal(criterionSaveRes.body._id);
                        (criterionInfoRes.body.name).should.equal(criterion.name);
                        should.equal(criterionInfoRes.body.user, undefined);

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
      Criterion.remove().exec(done);
    });
  });
});
