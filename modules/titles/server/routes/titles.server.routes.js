'use strict';

/**
 * Module dependencies
 */
var titlesPolicy = require('../policies/titles.server.policy'),
  titles = require('../controllers/titles.server.controller');

module.exports = function(app) {
  // Titles Routes
  app.route('/api/titles').all(titlesPolicy.isAllowed)
    .get(titles.list)
    .post(titles.create);

  app.route('/api/titles/:titleId').all(titlesPolicy.isAllowed)
    .get(titles.read)
    .put(titles.update)
    .delete(titles.delete);

  // Finish by binding the Title middleware
  app.param('titleId', titles.titleByID);
};
