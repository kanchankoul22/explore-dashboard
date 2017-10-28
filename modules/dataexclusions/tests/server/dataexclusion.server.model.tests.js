'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dataexclusion = mongoose.model('Dataexclusion');

/**
 * Globals
 */
var user,
  dataexclusion;

/**
 * Unit tests
 */
describe('Dataexclusion Model Unit Tests:', function() {
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
      dataexclusion = new Dataexclusion({
        name: 'Dataexclusion Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return dataexclusion.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      dataexclusion.name = '';

      return dataexclusion.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Dataexclusion.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
