'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Collection = mongoose.model('Collection'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Collection
 */
exports.create = function(req, res) {
  var collection = new Collection(req.body);
  collection.user = req.user;

  collection.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collection);
    }
  });
};

/**
 * Show the current Collection
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var collection = req.collection ? req.collection.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  collection.isCurrentUserOwner = req.user && collection.user && collection.user._id.toString() === req.user._id.toString();

  res.jsonp(collection);
};

/**
 * Update a Collection
 */
exports.update = function(req, res) {
  var collection = req.collection;

  collection = _.extend(collection, req.body);

  collection.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collection);
    }
  });
};

/**
 * Delete an Collection
 */
exports.delete = function(req, res) {
  var collection = req.collection;

  collection.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collection);
    }
  });
};

/**
 * List of Collections
 */
exports.list = function(req, res) {
  Collection.find().sort('-created').populate('user', 'displayName').exec(function(err, collections) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collections);
    }
  });
};

/**
 * Collection middleware
 */
exports.collectionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Collection is invalid'
    });
  }

  Collection.findById(id).populate('user', 'displayName').exec(function (err, collection) {
    if (err) {
      return next(err);
    } else if (!collection) {
      return res.status(404).send({
        message: 'No Collection with that identifier has been found'
      });
    }
    req.collection = collection;
    next();
  });
};
