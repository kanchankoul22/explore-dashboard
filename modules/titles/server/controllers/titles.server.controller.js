'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Title = mongoose.model('Title'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Title
 */
exports.create = function(req, res) {
  var title = new Title(req.body);
  title.user = req.user;

  title.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(title);
    }
  });
};

/**
 * Show the current Title
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var title = req.title ? req.title.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  title.isCurrentUserOwner = req.user && title.user && title.user._id.toString() === req.user._id.toString();

  res.jsonp(title);
};

/**
 * Update a Title
 */
exports.update = function(req, res) {
  var title = req.title;

  title = _.extend(title, req.body);

  title.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(title);
    }
  });
};

/**
 * Delete an Title
 */
exports.delete = function(req, res) {
  var title = req.title;

  title.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(title);
    }
  });
};

/**
 * List of Titles
 */
exports.list = function(req, res) {
  Title.find().sort('-created').populate('user', 'displayName').exec(function(err, titles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(titles);
    }
  });
};

/**
 * Title middleware
 */
exports.titleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Title is invalid'
    });
  }

  Title.findById(id).populate('user', 'displayName').exec(function (err, title) {
    if (err) {
      return next(err);
    } else if (!title) {
      return res.status(404).send({
        message: 'No Title with that identifier has been found'
      });
    }
    req.title = title;
    next();
  });
};
