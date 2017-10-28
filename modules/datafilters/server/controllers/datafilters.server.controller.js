'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Datafilter = mongoose.model('Datafilter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Datafilter
 */
exports.create = function(req, res) {
  var datafilter = new Datafilter(req.body);
  datafilter.user = req.user;

  datafilter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datafilter);
    }
  });
};

/**
 * Show the current Datafilter
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var datafilter = req.datafilter ? req.datafilter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  datafilter.isCurrentUserOwner = req.user && datafilter.user && datafilter.user._id.toString() === req.user._id.toString();

  res.jsonp(datafilter);
};

/**
 * Update a Datafilter
 */
exports.update = function(req, res) {
  var datafilter = req.datafilter;

  datafilter = _.extend(datafilter, req.body);

  datafilter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datafilter);
    }
  });
};

/**
 * Delete an Datafilter
 */
exports.delete = function(req, res) {
  var datafilter = req.datafilter;

  datafilter.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datafilter);
    }
  });
};

/**
 * List of Datafilters
 */
exports.list = function(req, res) {
  Datafilter.find().sort('-created').populate('user', 'displayName').exec(function(err, datafilters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datafilters);
    }
  });
};

/**
 * Datafilter middleware
 */
exports.datafilterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Datafilter is invalid'
    });
  }

  Datafilter.findById(id).populate('user', 'displayName').exec(function (err, datafilter) {
    if (err) {
      return next(err);
    } else if (!datafilter) {
      return res.status(404).send({
        message: 'No Datafilter with that identifier has been found'
      });
    }
    req.datafilter = datafilter;
    next();
  });
};
