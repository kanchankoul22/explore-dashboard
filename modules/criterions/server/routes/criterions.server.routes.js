'use strict';

/**
 * Module dependencies
 */
var criterionsPolicy = require('../policies/criterions.server.policy'),
  criterions = require('../controllers/criterions.server.controller');

module.exports = function(app) {
  // Criterions Routes
  app.route('/api/criterions').all(criterionsPolicy.isAllowed)
    .get(criterions.list)
    .post(criterions.create);

  app.route('/api/criterions/:criterionId').all(criterionsPolicy.isAllowed)
    .get(criterions.read)
    .put(criterions.update)
    .delete(criterions.delete);

  // Finish by binding the Criterion middleware
  app.param('criterionId', criterions.criterionByID);
};
