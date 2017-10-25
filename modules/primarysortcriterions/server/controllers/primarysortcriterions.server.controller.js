'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Primarysortcriterion = mongoose.model('Primarysortcriterion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Primarysortcriterion
 */
exports.create = function(req, res) {
  var primarysortcriterion = new Primarysortcriterion(req.body);
  primarysortcriterion.user = req.user;

  primarysortcriterion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(primarysortcriterion);
    }
  });
};

/**
 * Show the current Primarysortcriterion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var primarysortcriterion = req.primarysortcriterion ? req.primarysortcriterion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  primarysortcriterion.isCurrentUserOwner = req.user && primarysortcriterion.user && primarysortcriterion.user._id.toString() === req.user._id.toString();

  res.jsonp(primarysortcriterion);
};

/**
 * Update a Primarysortcriterion
 */
exports.update = function(req, res) {
  var primarysortcriterion = req.primarysortcriterion;

  primarysortcriterion = _.extend(primarysortcriterion, req.body);

  primarysortcriterion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(primarysortcriterion);
    }
  });
};

/**
 * Delete an Primarysortcriterion
 */
exports.delete = function(req, res) {
  var primarysortcriterion = req.primarysortcriterion;

  primarysortcriterion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(primarysortcriterion);
    }
  });
};

/**
 * List of Primarysortcriterions
 */
exports.list = function(req, res) {
  Primarysortcriterion.find().sort('-created').populate('user', 'displayName').exec(function(err, primarysortcriterions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(primarysortcriterions);
    }
  });
};

/**
 * Primarysortcriterion middleware
 */
exports.primarysortcriterionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Primarysortcriterion is invalid'
    });
  }

  Primarysortcriterion.findById(id).populate('user', 'displayName').exec(function (err, primarysortcriterion) {
    if (err) {
      return next(err);
    } else if (!primarysortcriterion) {
      return res.status(404).send({
        message: 'No Primarysortcriterion with that identifier has been found'
      });
    }
    req.primarysortcriterion = primarysortcriterion;
    next();
  });
};
