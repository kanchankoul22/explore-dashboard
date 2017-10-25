'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hurdle = mongoose.model('Hurdle'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Hurdle
 */
exports.create = function(req, res) {
  var hurdle = new Hurdle(req.body);
  hurdle.user = req.user;

  hurdle.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hurdle);
    }
  });
};

/**
 * Show the current Hurdle
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var hurdle = req.hurdle ? req.hurdle.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  hurdle.isCurrentUserOwner = req.user && hurdle.user && hurdle.user._id.toString() === req.user._id.toString();

  res.jsonp(hurdle);
};

/**
 * Update a Hurdle
 */
exports.update = function(req, res) {
  var hurdle = req.hurdle;

  hurdle = _.extend(hurdle, req.body);

  hurdle.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hurdle);
    }
  });
};

/**
 * Delete an Hurdle
 */
exports.delete = function(req, res) {
  var hurdle = req.hurdle;

  hurdle.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hurdle);
    }
  });
};

/**
 * List of Hurdles
 */
exports.list = function(req, res) {
  Hurdle.find().sort('-created').populate('user', 'displayName').exec(function(err, hurdles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hurdles);
    }
  });
};

/**
 * Hurdle middleware
 */
exports.hurdleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hurdle is invalid'
    });
  }

  Hurdle.findById(id).populate('user', 'displayName').exec(function (err, hurdle) {
    if (err) {
      return next(err);
    } else if (!hurdle) {
      return res.status(404).send({
        message: 'No Hurdle with that identifier has been found'
      });
    }
    req.hurdle = hurdle;
    next();
  });
};
