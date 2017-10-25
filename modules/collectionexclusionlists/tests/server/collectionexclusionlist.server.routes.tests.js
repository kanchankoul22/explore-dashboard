'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Collectionexclusionlist = mongoose.model('Collectionexclusionlist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  collectionexclusionlist;

/**
 * Collectionexclusionlist routes tests
 */
describe('Collectionexclusionlist CRUD tests', function () {

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

    // Save a user to the test db and create new Collectionexclusionlist
    user.save(function () {
      collectionexclusionlist = {
        name: 'Collectionexclusionlist name'
      };

      done();
    });
  });

  it('should be able to save a Collectionexclusionlist if logged in', function (done) {
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

        // Save a new Collectionexclusionlist
        agent.post('/api/collectionexclusionlists')
          .send(collectionexclusionlist)
          .expect(200)
          .end(function (collectionexclusionlistSaveErr, collectionexclusionlistSaveRes) {
            // Handle Collectionexclusionlist save error
            if (collectionexclusionlistSaveErr) {
              return done(collectionexclusionlistSaveErr);
            }

            // Get a list of Collectionexclusionlists
            agent.get('/api/collectionexclusionlists')
              .end(function (collectionexclusionlistsGetErr, collectionexclusionlistsGetRes) {
                // Handle Collectionexclusionlists save error
                if (collectionexclusionlistsGetErr) {
                  return done(collectionexclusionlistsGetErr);
                }

                // Get Collectionexclusionlists list
                var collectionexclusionlists = collectionexclusionlistsGetRes.body;

                // Set assertions
                (collectionexclusionlists[0].user._id).should.equal(userId);
                (collectionexclusionlists[0].name).should.match('Collectionexclusionlist name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Collectionexclusionlist if not logged in', function (done) {
    agent.post('/api/collectionexclusionlists')
      .send(collectionexclusionlist)
      .expect(403)
      .end(function (collectionexclusionlistSaveErr, collectionexclusionlistSaveRes) {
        // Call the assertion callback
        done(collectionexclusionlistSaveErr);
      });
  });

  it('should not be able to save an Collectionexclusionlist if no name is provided', function (done) {
    // Invalidate name field
    collectionexclusionlist.name = '';

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

        // Save a new Collectionexclusionlist
        agent.post('/api/collectionexclusionlists')
          .send(collectionexclusionlist)
          .expect(400)
          .end(function (collectionexclusionlistSaveErr, collectionexclusionlistSaveRes) {
            // Set message assertion
            (collectionexclusionlistSaveRes.body.message).should.match('Please fill Collectionexclusionlist name');

            // Handle Collectionexclusionlist save error
            done(collectionexclusionlistSaveErr);
          });
      });
  });

  it('should be able to update an Collectionexclusionlist if signed in', function (done) {
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

        // Save a new Collectionexclusionlist
        agent.post('/api/collectionexclusionlists')
          .send(collectionexclusionlist)
          .expect(200)
          .end(function (collectionexclusionlistSaveErr, collectionexclusionlistSaveRes) {
            // Handle Collectionexclusionlist save error
            if (collectionexclusionlistSaveErr) {
              return done(collectionexclusionlistSaveErr);
            }

            // Update Collectionexclusionlist name
            collectionexclusionlist.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Collectionexclusionlist
            agent.put('/api/collectionexclusionlists/' + collectionexclusionlistSaveRes.body._id)
              .send(collectionexclusionlist)
              .expect(200)
              .end(function (collectionexclusionlistUpdateErr, collectionexclusionlistUpdateRes) {
                // Handle Collectionexclusionlist update error
                if (collectionexclusionlistUpdateErr) {
                  return done(collectionexclusionlistUpdateErr);
                }

                // Set assertions
                (collectionexclusionlistUpdateRes.body._id).should.equal(collectionexclusionlistSaveRes.body._id);
                (collectionexclusionlistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Collectionexclusionlists if not signed in', function (done) {
    // Create new Collectionexclusionlist model instance
    var collectionexclusionlistObj = new Collectionexclusionlist(collectionexclusionlist);

    // Save the collectionexclusionlist
    collectionexclusionlistObj.save(function () {
      // Request Collectionexclusionlists
      request(app).get('/api/collectionexclusionlists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Collectionexclusionlist if not signed in', function (done) {
    // Create new Collectionexclusionlist model instance
    var collectionexclusionlistObj = new Collectionexclusionlist(collectionexclusionlist);

    // Save the Collectionexclusionlist
    collectionexclusionlistObj.save(function () {
      request(app).get('/api/collectionexclusionlists/' + collectionexclusionlistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', collectionexclusionlist.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Collectionexclusionlist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/collectionexclusionlists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Collectionexclusionlist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Collectionexclusionlist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Collectionexclusionlist
    request(app).get('/api/collectionexclusionlists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Collectionexclusionlist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Collectionexclusionlist if signed in', function (done) {
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

        // Save a new Collectionexclusionlist
        agent.post('/api/collectionexclusionlists')
          .send(collectionexclusionlist)
          .expect(200)
          .end(function (collectionexclusionlistSaveErr, collectionexclusionlistSaveRes) {
            // Handle Collectionexclusionlist save error
            if (collectionexclusionlistSaveErr) {
              return done(collectionexclusionlistSaveErr);
            }

            // Delete an existing Collectionexclusionlist
            agent.delete('/api/collectionexclusionlists/' + collectionexclusionlistSaveRes.body._id)
              .send(collectionexclusionlist)
              .expect(200)
              .end(function (collectionexclusionlistDeleteErr, collectionexclusionlistDeleteRes) {
                // Handle collectionexclusionlist error error
                if (collectionexclusionlistDeleteErr) {
                  return done(collectionexclusionlistDeleteErr);
                }

                // Set assertions
                (collectionexclusionlistDeleteRes.body._id).should.equal(collectionexclusionlistSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Collectionexclusionlist if not signed in', function (done) {
    // Set Collectionexclusionlist user
    collectionexclusionlist.user = user;

    // Create new Collectionexclusionlist model instance
    var collectionexclusionlistObj = new Collectionexclusionlist(collectionexclusionlist);

    // Save the Collectionexclusionlist
    collectionexclusionlistObj.save(function () {
      // Try deleting Collectionexclusionlist
      request(app).delete('/api/collectionexclusionlists/' + collectionexclusionlistObj._id)
        .expect(403)
        .end(function (collectionexclusionlistDeleteErr, collectionexclusionlistDeleteRes) {
          // Set message assertion
          (collectionexclusionlistDeleteRes.body.message).should.match('User is not authorized');

          // Handle Collectionexclusionlist error error
          done(collectionexclusionlistDeleteErr);
        });

    });
  });

  it('should be able to get a single Collectionexclusionlist that has an orphaned user reference', function (done) {
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

          // Save a new Collectionexclusionlist
          agent.post('/api/collectionexclusionlists')
            .send(collectionexclusionlist)
            .expect(200)
            .end(function (collectionexclusionlistSaveErr, collectionexclusionlistSaveRes) {
              // Handle Collectionexclusionlist save error
              if (collectionexclusionlistSaveErr) {
                return done(collectionexclusionlistSaveErr);
              }

              // Set assertions on new Collectionexclusionlist
              (collectionexclusionlistSaveRes.body.name).should.equal(collectionexclusionlist.name);
              should.exist(collectionexclusionlistSaveRes.body.user);
              should.equal(collectionexclusionlistSaveRes.body.user._id, orphanId);

              // force the Collectionexclusionlist to have an orphaned user reference
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

                    // Get the Collectionexclusionlist
                    agent.get('/api/collectionexclusionlists/' + collectionexclusionlistSaveRes.body._id)
                      .expect(200)
                      .end(function (collectionexclusionlistInfoErr, collectionexclusionlistInfoRes) {
                        // Handle Collectionexclusionlist error
                        if (collectionexclusionlistInfoErr) {
                          return done(collectionexclusionlistInfoErr);
                        }

                        // Set assertions
                        (collectionexclusionlistInfoRes.body._id).should.equal(collectionexclusionlistSaveRes.body._id);
                        (collectionexclusionlistInfoRes.body.name).should.equal(collectionexclusionlist.name);
                        should.equal(collectionexclusionlistInfoRes.body.user, undefined);

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
      Collectionexclusionlist.remove().exec(done);
    });
  });
});
