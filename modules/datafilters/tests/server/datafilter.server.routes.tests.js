'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Datafilter = mongoose.model('Datafilter'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  datafilter;

/**
 * Datafilter routes tests
 */
describe('Datafilter CRUD tests', function () {

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

    // Save a user to the test db and create new Datafilter
    user.save(function () {
      datafilter = {
        name: 'Datafilter name'
      };

      done();
    });
  });

  it('should be able to save a Datafilter if logged in', function (done) {
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

        // Save a new Datafilter
        agent.post('/api/datafilters')
          .send(datafilter)
          .expect(200)
          .end(function (datafilterSaveErr, datafilterSaveRes) {
            // Handle Datafilter save error
            if (datafilterSaveErr) {
              return done(datafilterSaveErr);
            }

            // Get a list of Datafilters
            agent.get('/api/datafilters')
              .end(function (datafiltersGetErr, datafiltersGetRes) {
                // Handle Datafilters save error
                if (datafiltersGetErr) {
                  return done(datafiltersGetErr);
                }

                // Get Datafilters list
                var datafilters = datafiltersGetRes.body;

                // Set assertions
                (datafilters[0].user._id).should.equal(userId);
                (datafilters[0].name).should.match('Datafilter name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Datafilter if not logged in', function (done) {
    agent.post('/api/datafilters')
      .send(datafilter)
      .expect(403)
      .end(function (datafilterSaveErr, datafilterSaveRes) {
        // Call the assertion callback
        done(datafilterSaveErr);
      });
  });

  it('should not be able to save an Datafilter if no name is provided', function (done) {
    // Invalidate name field
    datafilter.name = '';

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

        // Save a new Datafilter
        agent.post('/api/datafilters')
          .send(datafilter)
          .expect(400)
          .end(function (datafilterSaveErr, datafilterSaveRes) {
            // Set message assertion
            (datafilterSaveRes.body.message).should.match('Please fill Datafilter name');

            // Handle Datafilter save error
            done(datafilterSaveErr);
          });
      });
  });

  it('should be able to update an Datafilter if signed in', function (done) {
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

        // Save a new Datafilter
        agent.post('/api/datafilters')
          .send(datafilter)
          .expect(200)
          .end(function (datafilterSaveErr, datafilterSaveRes) {
            // Handle Datafilter save error
            if (datafilterSaveErr) {
              return done(datafilterSaveErr);
            }

            // Update Datafilter name
            datafilter.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Datafilter
            agent.put('/api/datafilters/' + datafilterSaveRes.body._id)
              .send(datafilter)
              .expect(200)
              .end(function (datafilterUpdateErr, datafilterUpdateRes) {
                // Handle Datafilter update error
                if (datafilterUpdateErr) {
                  return done(datafilterUpdateErr);
                }

                // Set assertions
                (datafilterUpdateRes.body._id).should.equal(datafilterSaveRes.body._id);
                (datafilterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Datafilters if not signed in', function (done) {
    // Create new Datafilter model instance
    var datafilterObj = new Datafilter(datafilter);

    // Save the datafilter
    datafilterObj.save(function () {
      // Request Datafilters
      request(app).get('/api/datafilters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Datafilter if not signed in', function (done) {
    // Create new Datafilter model instance
    var datafilterObj = new Datafilter(datafilter);

    // Save the Datafilter
    datafilterObj.save(function () {
      request(app).get('/api/datafilters/' + datafilterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', datafilter.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Datafilter with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/datafilters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Datafilter is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Datafilter which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Datafilter
    request(app).get('/api/datafilters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Datafilter with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Datafilter if signed in', function (done) {
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

        // Save a new Datafilter
        agent.post('/api/datafilters')
          .send(datafilter)
          .expect(200)
          .end(function (datafilterSaveErr, datafilterSaveRes) {
            // Handle Datafilter save error
            if (datafilterSaveErr) {
              return done(datafilterSaveErr);
            }

            // Delete an existing Datafilter
            agent.delete('/api/datafilters/' + datafilterSaveRes.body._id)
              .send(datafilter)
              .expect(200)
              .end(function (datafilterDeleteErr, datafilterDeleteRes) {
                // Handle datafilter error error
                if (datafilterDeleteErr) {
                  return done(datafilterDeleteErr);
                }

                // Set assertions
                (datafilterDeleteRes.body._id).should.equal(datafilterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Datafilter if not signed in', function (done) {
    // Set Datafilter user
    datafilter.user = user;

    // Create new Datafilter model instance
    var datafilterObj = new Datafilter(datafilter);

    // Save the Datafilter
    datafilterObj.save(function () {
      // Try deleting Datafilter
      request(app).delete('/api/datafilters/' + datafilterObj._id)
        .expect(403)
        .end(function (datafilterDeleteErr, datafilterDeleteRes) {
          // Set message assertion
          (datafilterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Datafilter error error
          done(datafilterDeleteErr);
        });

    });
  });

  it('should be able to get a single Datafilter that has an orphaned user reference', function (done) {
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

          // Save a new Datafilter
          agent.post('/api/datafilters')
            .send(datafilter)
            .expect(200)
            .end(function (datafilterSaveErr, datafilterSaveRes) {
              // Handle Datafilter save error
              if (datafilterSaveErr) {
                return done(datafilterSaveErr);
              }

              // Set assertions on new Datafilter
              (datafilterSaveRes.body.name).should.equal(datafilter.name);
              should.exist(datafilterSaveRes.body.user);
              should.equal(datafilterSaveRes.body.user._id, orphanId);

              // force the Datafilter to have an orphaned user reference
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

                    // Get the Datafilter
                    agent.get('/api/datafilters/' + datafilterSaveRes.body._id)
                      .expect(200)
                      .end(function (datafilterInfoErr, datafilterInfoRes) {
                        // Handle Datafilter error
                        if (datafilterInfoErr) {
                          return done(datafilterInfoErr);
                        }

                        // Set assertions
                        (datafilterInfoRes.body._id).should.equal(datafilterSaveRes.body._id);
                        (datafilterInfoRes.body.name).should.equal(datafilter.name);
                        should.equal(datafilterInfoRes.body.user, undefined);

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
      Datafilter.remove().exec(done);
    });
  });
});
