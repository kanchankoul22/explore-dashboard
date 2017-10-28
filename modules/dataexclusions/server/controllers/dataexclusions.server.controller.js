'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dataexclusion = mongoose.model('Dataexclusion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Dataexclusion
 */
exports.create = function(req, res) {
  var dataexclusion = new Dataexclusion(req.body);
  dataexclusion.user = req.user;

  dataexclusion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dataexclusion);
    }
  });
};

/**
 * Show the current Dataexclusion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dataexclusion = req.dataexclusion ? req.dataexclusion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  dataexclusion.isCurrentUserOwner = req.user && dataexclusion.user && dataexclusion.user._id.toString() === req.user._id.toString();

  res.jsonp(dataexclusion);
};

/**
 * Update a Dataexclusion
 */
exports.update = function(req, res) {
  var dataexclusion = req.dataexclusion;

  dataexclusion = _.extend(dataexclusion, req.body);

  dataexclusion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dataexclusion);
    }
  });
};

/**
 * Delete an Dataexclusion
 */
exports.delete = function(req, res) {
  var dataexclusion = req.dataexclusion;

  dataexclusion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dataexclusion);
    }
  });
};

/**
 * List of Dataexclusions
 */
exports.list = function(req, res) {
  Dataexclusion.find().sort('-created').populate('user', 'displayName').exec(function(err, dataexclusions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dataexclusions);
    }
  });
};

/**
 * Dataexclusion middleware
 */
exports.dataexclusionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dataexclusion is invalid'
    });
  }

  Dataexclusion.findById(id).populate('user', 'displayName').exec(function (err, dataexclusion) {
    if (err) {
      return next(err);
    } else if (!dataexclusion) {
      return res.status(404).send({
        message: 'No Dataexclusion with that identifier has been found'
      });
    }
    req.dataexclusion = dataexclusion;
    next();
  });
};
