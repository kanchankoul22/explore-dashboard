'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Collectionset = mongoose.model('Collectionset'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Collectionset
 */
exports.create = function(req, res) {
  var collectionset = new Collectionset(req.body);
  collectionset.user = req.user;

  collectionset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionset);
    }
  });
};

/**
 * Show the current Collectionset
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var collectionset = req.collectionset ? req.collectionset.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  collectionset.isCurrentUserOwner = req.user && collectionset.user && collectionset.user._id.toString() === req.user._id.toString();

  res.jsonp(collectionset);
};

/**
 * Update a Collectionset
 */
exports.update = function(req, res) {
  var collectionset = req.collectionset;

  collectionset = _.extend(collectionset, req.body);

  collectionset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionset);
    }
  });
};

/**
 * Delete an Collectionset
 */
exports.delete = function(req, res) {
  var collectionset = req.collectionset;

  collectionset.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionset);
    }
  });
};

/**
 * List of Collectionsets
 */
exports.list = function(req, res) {
  Collectionset.find().sort('-created').populate('user', 'displayName').exec(function(err, collectionsets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionsets);
    }
  });
};

/**
 * Collectionset middleware
 */
exports.collectionsetByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Collectionset is invalid'
    });
  }

  Collectionset.findById(id).populate('user', 'displayName').exec(function (err, collectionset) {
    if (err) {
      return next(err);
    } else if (!collectionset) {
      return res.status(404).send({
        message: 'No Collectionset with that identifier has been found'
      });
    }
    req.collectionset = collectionset;
    next();
  });
};
