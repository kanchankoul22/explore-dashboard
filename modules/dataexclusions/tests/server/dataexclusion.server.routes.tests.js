'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dataexclusion = mongoose.model('Dataexclusion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  dataexclusion;

/**
 * Dataexclusion routes tests
 */
describe('Dataexclusion CRUD tests', function () {

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

    // Save a user to the test db and create new Dataexclusion
    user.save(function () {
      dataexclusion = {
        name: 'Dataexclusion name'
      };

      done();
    });
  });

  it('should be able to save a Dataexclusion if logged in', function (done) {
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

        // Save a new Dataexclusion
        agent.post('/api/dataexclusions')
          .send(dataexclusion)
          .expect(200)
          .end(function (dataexclusionSaveErr, dataexclusionSaveRes) {
            // Handle Dataexclusion save error
            if (dataexclusionSaveErr) {
              return done(dataexclusionSaveErr);
            }

            // Get a list of Dataexclusions
            agent.get('/api/dataexclusions')
              .end(function (dataexclusionsGetErr, dataexclusionsGetRes) {
                // Handle Dataexclusions save error
                if (dataexclusionsGetErr) {
                  return done(dataexclusionsGetErr);
                }

                // Get Dataexclusions list
                var dataexclusions = dataexclusionsGetRes.body;

                // Set assertions
                (dataexclusions[0].user._id).should.equal(userId);
                (dataexclusions[0].name).should.match('Dataexclusion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Dataexclusion if not logged in', function (done) {
    agent.post('/api/dataexclusions')
      .send(dataexclusion)
      .expect(403)
      .end(function (dataexclusionSaveErr, dataexclusionSaveRes) {
        // Call the assertion callback
        done(dataexclusionSaveErr);
      });
  });

  it('should not be able to save an Dataexclusion if no name is provided', function (done) {
    // Invalidate name field
    dataexclusion.name = '';

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

        // Save a new Dataexclusion
        agent.post('/api/dataexclusions')
          .send(dataexclusion)
          .expect(400)
          .end(function (dataexclusionSaveErr, dataexclusionSaveRes) {
            // Set message assertion
            (dataexclusionSaveRes.body.message).should.match('Please fill Dataexclusion name');

            // Handle Dataexclusion save error
            done(dataexclusionSaveErr);
          });
      });
  });

  it('should be able to update an Dataexclusion if signed in', function (done) {
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

        // Save a new Dataexclusion
        agent.post('/api/dataexclusions')
          .send(dataexclusion)
          .expect(200)
          .end(function (dataexclusionSaveErr, dataexclusionSaveRes) {
            // Handle Dataexclusion save error
            if (dataexclusionSaveErr) {
              return done(dataexclusionSaveErr);
            }

            // Update Dataexclusion name
            dataexclusion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Dataexclusion
            agent.put('/api/dataexclusions/' + dataexclusionSaveRes.body._id)
              .send(dataexclusion)
              .expect(200)
              .end(function (dataexclusionUpdateErr, dataexclusionUpdateRes) {
                // Handle Dataexclusion update error
                if (dataexclusionUpdateErr) {
                  return done(dataexclusionUpdateErr);
                }

                // Set assertions
                (dataexclusionUpdateRes.body._id).should.equal(dataexclusionSaveRes.body._id);
                (dataexclusionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Dataexclusions if not signed in', function (done) {
    // Create new Dataexclusion model instance
    var dataexclusionObj = new Dataexclusion(dataexclusion);

    // Save the dataexclusion
    dataexclusionObj.save(function () {
      // Request Dataexclusions
      request(app).get('/api/dataexclusions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Dataexclusion if not signed in', function (done) {
    // Create new Dataexclusion model instance
    var dataexclusionObj = new Dataexclusion(dataexclusion);

    // Save the Dataexclusion
    dataexclusionObj.save(function () {
      request(app).get('/api/dataexclusions/' + dataexclusionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', dataexclusion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Dataexclusion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/dataexclusions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Dataexclusion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Dataexclusion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Dataexclusion
    request(app).get('/api/dataexclusions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Dataexclusion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Dataexclusion if signed in', function (done) {
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

        // Save a new Dataexclusion
        agent.post('/api/dataexclusions')
          .send(dataexclusion)
          .expect(200)
          .end(function (dataexclusionSaveErr, dataexclusionSaveRes) {
            // Handle Dataexclusion save error
            if (dataexclusionSaveErr) {
              return done(dataexclusionSaveErr);
            }

            // Delete an existing Dataexclusion
            agent.delete('/api/dataexclusions/' + dataexclusionSaveRes.body._id)
              .send(dataexclusion)
              .expect(200)
              .end(function (dataexclusionDeleteErr, dataexclusionDeleteRes) {
                // Handle dataexclusion error error
                if (dataexclusionDeleteErr) {
                  return done(dataexclusionDeleteErr);
                }

                // Set assertions
                (dataexclusionDeleteRes.body._id).should.equal(dataexclusionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Dataexclusion if not signed in', function (done) {
    // Set Dataexclusion user
    dataexclusion.user = user;

    // Create new Dataexclusion model instance
    var dataexclusionObj = new Dataexclusion(dataexclusion);

    // Save the Dataexclusion
    dataexclusionObj.save(function () {
      // Try deleting Dataexclusion
      request(app).delete('/api/dataexclusions/' + dataexclusionObj._id)
        .expect(403)
        .end(function (dataexclusionDeleteErr, dataexclusionDeleteRes) {
          // Set message assertion
          (dataexclusionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Dataexclusion error error
          done(dataexclusionDeleteErr);
        });

    });
  });

  it('should be able to get a single Dataexclusion that has an orphaned user reference', function (done) {
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

          // Save a new Dataexclusion
          agent.post('/api/dataexclusions')
            .send(dataexclusion)
            .expect(200)
            .end(function (dataexclusionSaveErr, dataexclusionSaveRes) {
              // Handle Dataexclusion save error
              if (dataexclusionSaveErr) {
                return done(dataexclusionSaveErr);
              }

              // Set assertions on new Dataexclusion
              (dataexclusionSaveRes.body.name).should.equal(dataexclusion.name);
              should.exist(dataexclusionSaveRes.body.user);
              should.equal(dataexclusionSaveRes.body.user._id, orphanId);

              // force the Dataexclusion to have an orphaned user reference
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

                    // Get the Dataexclusion
                    agent.get('/api/dataexclusions/' + dataexclusionSaveRes.body._id)
                      .expect(200)
                      .end(function (dataexclusionInfoErr, dataexclusionInfoRes) {
                        // Handle Dataexclusion error
                        if (dataexclusionInfoErr) {
                          return done(dataexclusionInfoErr);
                        }

                        // Set assertions
                        (dataexclusionInfoRes.body._id).should.equal(dataexclusionSaveRes.body._id);
                        (dataexclusionInfoRes.body.name).should.equal(dataexclusion.name);
                        should.equal(dataexclusionInfoRes.body.user, undefined);

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
      Dataexclusion.remove().exec(done);
    });
  });
});
