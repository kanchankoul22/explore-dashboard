'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Collectionexclusionlist = mongoose.model('Collectionexclusionlist');

/**
 * Globals
 */
var user,
  collectionexclusionlist;

/**
 * Unit tests
 */
describe('Collectionexclusionlist Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      collectionexclusionlist = new Collectionexclusionlist({
        name: 'Collectionexclusionlist Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return collectionexclusionlist.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      collectionexclusionlist.name = '';

      return collectionexclusionlist.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Collectionexclusionlist.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
