'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Criterion = mongoose.model('Criterion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Criterion
 */
exports.create = function(req, res) {
  var criterion = new Criterion(req.body);
  criterion.user = req.user;

  criterion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criterion);
    }
  });
};

/**
 * Show the current Criterion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var criterion = req.criterion ? req.criterion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  criterion.isCurrentUserOwner = req.user && criterion.user && criterion.user._id.toString() === req.user._id.toString();

  res.jsonp(criterion);
};

/**
 * Update a Criterion
 */
exports.update = function(req, res) {
  var criterion = req.criterion;

  criterion = _.extend(criterion, req.body);

  criterion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criterion);
    }
  });
};

/**
 * Delete an Criterion
 */
exports.delete = function(req, res) {
  var criterion = req.criterion;

  criterion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criterion);
    }
  });
};

/**
 * List of Criterions
 */
exports.list = function(req, res) {
  Criterion.find().sort('-created').populate('user', 'displayName').exec(function(err, criterions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criterions);
    }
  });
};

/**
 * Criterion middleware
 */
exports.criterionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Criterion is invalid'
    });
  }

  Criterion.findById(id).populate('user', 'displayName').exec(function (err, criterion) {
    if (err) {
      return next(err);
    } else if (!criterion) {
      return res.status(404).send({
        message: 'No Criterion with that identifier has been found'
      });
    }
    req.criterion = criterion;
    next();
  });
};
