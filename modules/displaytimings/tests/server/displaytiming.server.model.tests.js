'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Displaytiming = mongoose.model('Displaytiming');

/**
 * Globals
 */
var user,
  displaytiming;

/**
 * Unit tests
 */
describe('Displaytiming Model Unit Tests:', function() {
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
      displaytiming = new Displaytiming({
        name: 'Displaytiming Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return displaytiming.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      displaytiming.name = '';

      return displaytiming.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Displaytiming.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
