'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Collectionexclusionlist = mongoose.model('Collectionexclusionlist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Collectionexclusionlist
 */
exports.create = function(req, res) {
  var collectionexclusionlist = new Collectionexclusionlist(req.body);
  collectionexclusionlist.user = req.user;

  collectionexclusionlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionexclusionlist);
    }
  });
};

/**
 * Show the current Collectionexclusionlist
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var collectionexclusionlist = req.collectionexclusionlist ? req.collectionexclusionlist.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  collectionexclusionlist.isCurrentUserOwner = req.user && collectionexclusionlist.user && collectionexclusionlist.user._id.toString() === req.user._id.toString();

  res.jsonp(collectionexclusionlist);
};

/**
 * Update a Collectionexclusionlist
 */
exports.update = function(req, res) {
  var collectionexclusionlist = req.collectionexclusionlist;

  collectionexclusionlist = _.extend(collectionexclusionlist, req.body);

  collectionexclusionlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionexclusionlist);
    }
  });
};

/**
 * Delete an Collectionexclusionlist
 */
exports.delete = function(req, res) {
  var collectionexclusionlist = req.collectionexclusionlist;

  collectionexclusionlist.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionexclusionlist);
    }
  });
};

/**
 * List of Collectionexclusionlists
 */
exports.list = function(req, res) {
  Collectionexclusionlist.find().sort('-created').populate('user', 'displayName').exec(function(err, collectionexclusionlists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectionexclusionlists);
    }
  });
};

/**
 * Collectionexclusionlist middleware
 */
exports.collectionexclusionlistByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Collectionexclusionlist is invalid'
    });
  }

  Collectionexclusionlist.findById(id).populate('user', 'displayName').exec(function (err, collectionexclusionlist) {
    if (err) {
      return next(err);
    } else if (!collectionexclusionlist) {
      return res.status(404).send({
        message: 'No Collectionexclusionlist with that identifier has been found'
      });
    }
    req.collectionexclusionlist = collectionexclusionlist;
    next();
  });
};
