'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Displaytiming = mongoose.model('Displaytiming'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Displaytiming
 */
exports.create = function(req, res) {
  var displaytiming = new Displaytiming(req.body);
  displaytiming.user = req.user;

  displaytiming.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(displaytiming);
    }
  });
};

/**
 * Show the current Displaytiming
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var displaytiming = req.displaytiming ? req.displaytiming.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  displaytiming.isCurrentUserOwner = req.user && displaytiming.user && displaytiming.user._id.toString() === req.user._id.toString();

  res.jsonp(displaytiming);
};

/**
 * Update a Displaytiming
 */
exports.update = function(req, res) {
  var displaytiming = req.displaytiming;

  displaytiming = _.extend(displaytiming, req.body);

  displaytiming.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(displaytiming);
    }
  });
};

/**
 * Delete an Displaytiming
 */
exports.delete = function(req, res) {
  var displaytiming = req.displaytiming;

  displaytiming.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(displaytiming);
    }
  });
};

/**
 * List of Displaytimings
 */
exports.list = function(req, res) {
  Displaytiming.find().sort('-created').populate('user', 'displayName').exec(function(err, displaytimings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(displaytimings);
    }
  });
};

/**
 * Displaytiming middleware
 */
exports.displaytimingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Displaytiming is invalid'
    });
  }

  Displaytiming.findById(id).populate('user', 'displayName').exec(function (err, displaytiming) {
    if (err) {
      return next(err);
    } else if (!displaytiming) {
      return res.status(404).send({
        message: 'No Displaytiming with that identifier has been found'
      });
    }
    req.displaytiming = displaytiming;
    next();
  });
};
