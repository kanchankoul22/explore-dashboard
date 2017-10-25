'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Collection = mongoose.model('Collection'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  collection;

/**
 * Collection routes tests
 */
describe('Collection CRUD tests', function () {

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

    // Save a user to the test db and create new Collection
    user.save(function () {
      collection = {
        name: 'Collection name'
      };

      done();
    });
  });

  it('should be able to save a Collection if logged in', function (done) {
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

        // Save a new Collection
        agent.post('/api/collections')
          .send(collection)
          .expect(200)
          .end(function (collectionSaveErr, collectionSaveRes) {
            // Handle Collection save error
            if (collectionSaveErr) {
              return done(collectionSaveErr);
            }

            // Get a list of Collections
            agent.get('/api/collections')
              .end(function (collectionsGetErr, collectionsGetRes) {
                // Handle Collections save error
                if (collectionsGetErr) {
                  return done(collectionsGetErr);
                }

                // Get Collections list
                var collections = collectionsGetRes.body;

                // Set assertions
                (collections[0].user._id).should.equal(userId);
                (collections[0].name).should.match('Collection name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Collection if not logged in', function (done) {
    agent.post('/api/collections')
      .send(collection)
      .expect(403)
      .end(function (collectionSaveErr, collectionSaveRes) {
        // Call the assertion callback
        done(collectionSaveErr);
      });
  });

  it('should not be able to save an Collection if no name is provided', function (done) {
    // Invalidate name field
    collection.name = '';

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

        // Save a new Collection
        agent.post('/api/collections')
          .send(collection)
          .expect(400)
          .end(function (collectionSaveErr, collectionSaveRes) {
            // Set message assertion
            (collectionSaveRes.body.message).should.match('Please fill Collection name');

            // Handle Collection save error
            done(collectionSaveErr);
          });
      });
  });

  it('should be able to update an Collection if signed in', function (done) {
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

        // Save a new Collection
        agent.post('/api/collections')
          .send(collection)
          .expect(200)
          .end(function (collectionSaveErr, collectionSaveRes) {
            // Handle Collection save error
            if (collectionSaveErr) {
              return done(collectionSaveErr);
            }

            // Update Collection name
            collection.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Collection
            agent.put('/api/collections/' + collectionSaveRes.body._id)
              .send(collection)
              .expect(200)
              .end(function (collectionUpdateErr, collectionUpdateRes) {
                // Handle Collection update error
                if (collectionUpdateErr) {
                  return done(collectionUpdateErr);
                }

                // Set assertions
                (collectionUpdateRes.body._id).should.equal(collectionSaveRes.body._id);
                (collectionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Collections if not signed in', function (done) {
    // Create new Collection model instance
    var collectionObj = new Collection(collection);

    // Save the collection
    collectionObj.save(function () {
      // Request Collections
      request(app).get('/api/collections')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Collection if not signed in', function (done) {
    // Create new Collection model instance
    var collectionObj = new Collection(collection);

    // Save the Collection
    collectionObj.save(function () {
      request(app).get('/api/collections/' + collectionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', collection.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Collection with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/collections/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Collection is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Collection which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Collection
    request(app).get('/api/collections/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Collection with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Collection if signed in', function (done) {
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

        // Save a new Collection
        agent.post('/api/collections')
          .send(collection)
          .expect(200)
          .end(function (collectionSaveErr, collectionSaveRes) {
            // Handle Collection save error
            if (collectionSaveErr) {
              return done(collectionSaveErr);
            }

            // Delete an existing Collection
            agent.delete('/api/collections/' + collectionSaveRes.body._id)
              .send(collection)
              .expect(200)
              .end(function (collectionDeleteErr, collectionDeleteRes) {
                // Handle collection error error
                if (collectionDeleteErr) {
                  return done(collectionDeleteErr);
                }

                // Set assertions
                (collectionDeleteRes.body._id).should.equal(collectionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Collection if not signed in', function (done) {
    // Set Collection user
    collection.user = user;

    // Create new Collection model instance
    var collectionObj = new Collection(collection);

    // Save the Collection
    collectionObj.save(function () {
      // Try deleting Collection
      request(app).delete('/api/collections/' + collectionObj._id)
        .expect(403)
        .end(function (collectionDeleteErr, collectionDeleteRes) {
          // Set message assertion
          (collectionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Collection error error
          done(collectionDeleteErr);
        });

    });
  });

  it('should be able to get a single Collection that has an orphaned user reference', function (done) {
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

          // Save a new Collection
          agent.post('/api/collections')
            .send(collection)
            .expect(200)
            .end(function (collectionSaveErr, collectionSaveRes) {
              // Handle Collection save error
              if (collectionSaveErr) {
                return done(collectionSaveErr);
              }

              // Set assertions on new Collection
              (collectionSaveRes.body.name).should.equal(collection.name);
              should.exist(collectionSaveRes.body.user);
              should.equal(collectionSaveRes.body.user._id, orphanId);

              // force the Collection to have an orphaned user reference
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

                    // Get the Collection
                    agent.get('/api/collections/' + collectionSaveRes.body._id)
                      .expect(200)
                      .end(function (collectionInfoErr, collectionInfoRes) {
                        // Handle Collection error
                        if (collectionInfoErr) {
                          return done(collectionInfoErr);
                        }

                        // Set assertions
                        (collectionInfoRes.body._id).should.equal(collectionSaveRes.body._id);
                        (collectionInfoRes.body.name).should.equal(collection.name);
                        should.equal(collectionInfoRes.body.user, undefined);

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
      Collection.remove().exec(done);
    });
  });
});
