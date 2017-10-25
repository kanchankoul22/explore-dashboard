'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Primarysortcriterion = mongoose.model('Primarysortcriterion');

/**
 * Globals
 */
var user,
  primarysortcriterion;

/**
 * Unit tests
 */
describe('Primarysortcriterion Model Unit Tests:', function() {
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
      primarysortcriterion = new Primarysortcriterion({
        name: 'Primarysortcriterion Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return primarysortcriterion.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      primarysortcriterion.name = '';

      return primarysortcriterion.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Primarysortcriterion.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
