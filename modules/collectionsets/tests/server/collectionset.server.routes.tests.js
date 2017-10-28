'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Collectionset = mongoose.model('Collectionset'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  collectionset;

/**
 * Collectionset routes tests
 */
describe('Collectionset CRUD tests', function () {

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

    // Save a user to the test db and create new Collectionset
    user.save(function () {
      collectionset = {
        name: 'Collectionset name'
      };

      done();
    });
  });

  it('should be able to save a Collectionset if logged in', function (done) {
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

        // Save a new Collectionset
        agent.post('/api/collectionsets')
          .send(collectionset)
          .expect(200)
          .end(function (collectionsetSaveErr, collectionsetSaveRes) {
            // Handle Collectionset save error
            if (collectionsetSaveErr) {
              return done(collectionsetSaveErr);
            }

            // Get a list of Collectionsets
            agent.get('/api/collectionsets')
              .end(function (collectionsetsGetErr, collectionsetsGetRes) {
                // Handle Collectionsets save error
                if (collectionsetsGetErr) {
                  return done(collectionsetsGetErr);
                }

                // Get Collectionsets list
                var collectionsets = collectionsetsGetRes.body;

                // Set assertions
                (collectionsets[0].user._id).should.equal(userId);
                (collectionsets[0].name).should.match('Collectionset name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Collectionset if not logged in', function (done) {
    agent.post('/api/collectionsets')
      .send(collectionset)
      .expect(403)
      .end(function (collectionsetSaveErr, collectionsetSaveRes) {
        // Call the assertion callback
        done(collectionsetSaveErr);
      });
  });

  it('should not be able to save an Collectionset if no name is provided', function (done) {
    // Invalidate name field
    collectionset.name = '';

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

        // Save a new Collectionset
        agent.post('/api/collectionsets')
          .send(collectionset)
          .expect(400)
          .end(function (collectionsetSaveErr, collectionsetSaveRes) {
            // Set message assertion
            (collectionsetSaveRes.body.message).should.match('Please fill Collectionset name');

            // Handle Collectionset save error
            done(collectionsetSaveErr);
          });
      });
  });

  it('should be able to update an Collectionset if signed in', function (done) {
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

        // Save a new Collectionset
        agent.post('/api/collectionsets')
          .send(collectionset)
          .expect(200)
          .end(function (collectionsetSaveErr, collectionsetSaveRes) {
            // Handle Collectionset save error
            if (collectionsetSaveErr) {
              return done(collectionsetSaveErr);
            }

            // Update Collectionset name
            collectionset.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Collectionset
            agent.put('/api/collectionsets/' + collectionsetSaveRes.body._id)
              .send(collectionset)
              .expect(200)
              .end(function (collectionsetUpdateErr, collectionsetUpdateRes) {
                // Handle Collectionset update error
                if (collectionsetUpdateErr) {
                  return done(collectionsetUpdateErr);
                }

                // Set assertions
                (collectionsetUpdateRes.body._id).should.equal(collectionsetSaveRes.body._id);
                (collectionsetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Collectionsets if not signed in', function (done) {
    // Create new Collectionset model instance
    var collectionsetObj = new Collectionset(collectionset);

    // Save the collectionset
    collectionsetObj.save(function () {
      // Request Collectionsets
      request(app).get('/api/collectionsets')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Collectionset if not signed in', function (done) {
    // Create new Collectionset model instance
    var collectionsetObj = new Collectionset(collectionset);

    // Save the Collectionset
    collectionsetObj.save(function () {
      request(app).get('/api/collectionsets/' + collectionsetObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', collectionset.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Collectionset with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/collectionsets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Collectionset is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Collectionset which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Collectionset
    request(app).get('/api/collectionsets/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Collectionset with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Collectionset if signed in', function (done) {
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

        // Save a new Collectionset
        agent.post('/api/collectionsets')
          .send(collectionset)
          .expect(200)
          .end(function (collectionsetSaveErr, collectionsetSaveRes) {
            // Handle Collectionset save error
            if (collectionsetSaveErr) {
              return done(collectionsetSaveErr);
            }

            // Delete an existing Collectionset
            agent.delete('/api/collectionsets/' + collectionsetSaveRes.body._id)
              .send(collectionset)
              .expect(200)
              .end(function (collectionsetDeleteErr, collectionsetDeleteRes) {
                // Handle collectionset error error
                if (collectionsetDeleteErr) {
                  return done(collectionsetDeleteErr);
                }

                // Set assertions
                (collectionsetDeleteRes.body._id).should.equal(collectionsetSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Collectionset if not signed in', function (done) {
    // Set Collectionset user
    collectionset.user = user;

    // Create new Collectionset model instance
    var collectionsetObj = new Collectionset(collectionset);

    // Save the Collectionset
    collectionsetObj.save(function () {
      // Try deleting Collectionset
      request(app).delete('/api/collectionsets/' + collectionsetObj._id)
        .expect(403)
        .end(function (collectionsetDeleteErr, collectionsetDeleteRes) {
          // Set message assertion
          (collectionsetDeleteRes.body.message).should.match('User is not authorized');

          // Handle Collectionset error error
          done(collectionsetDeleteErr);
        });

    });
  });

  it('should be able to get a single Collectionset that has an orphaned user reference', function (done) {
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

          // Save a new Collectionset
          agent.post('/api/collectionsets')
            .send(collectionset)
            .expect(200)
            .end(function (collectionsetSaveErr, collectionsetSaveRes) {
              // Handle Collectionset save error
              if (collectionsetSaveErr) {
                return done(collectionsetSaveErr);
              }

              // Set assertions on new Collectionset
              (collectionsetSaveRes.body.name).should.equal(collectionset.name);
              should.exist(collectionsetSaveRes.body.user);
              should.equal(collectionsetSaveRes.body.user._id, orphanId);

              // force the Collectionset to have an orphaned user reference
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

                    // Get the Collectionset
                    agent.get('/api/collectionsets/' + collectionsetSaveRes.body._id)
                      .expect(200)
                      .end(function (collectionsetInfoErr, collectionsetInfoRes) {
                        // Handle Collectionset error
                        if (collectionsetInfoErr) {
                          return done(collectionsetInfoErr);
                        }

                        // Set assertions
                        (collectionsetInfoRes.body._id).should.equal(collectionsetSaveRes.body._id);
                        (collectionsetInfoRes.body.name).should.equal(collectionset.name);
                        should.equal(collectionsetInfoRes.body.user, undefined);

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
      Collectionset.remove().exec(done);
    });
  });
});
