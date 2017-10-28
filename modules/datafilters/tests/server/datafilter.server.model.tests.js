'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Datafilter = mongoose.model('Datafilter');

/**
 * Globals
 */
var user,
  datafilter;

/**
 * Unit tests
 */
describe('Datafilter Model Unit Tests:', function() {
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
      datafilter = new Datafilter({
        name: 'Datafilter Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return datafilter.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      datafilter.name = '';

      return datafilter.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Datafilter.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
