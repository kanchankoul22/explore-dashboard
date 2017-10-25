'use strict';

/**
 * Module dependencies
 */
var primarysortcriterionsPolicy = require('../policies/primarysortcriterions.server.policy'),
  primarysortcriterions = require('../controllers/primarysortcriterions.server.controller');

module.exports = function(app) {
  // Primarysortcriterions Routes
  app.route('/api/primarysortcriterions').all(primarysortcriterionsPolicy.isAllowed)
    .get(primarysortcriterions.list)
    .post(primarysortcriterions.create);

  app.route('/api/primarysortcriterions/:primarysortcriterionId').all(primarysortcriterionsPolicy.isAllowed)
    .get(primarysortcriterions.read)
    .put(primarysortcriterions.update)
    .delete(primarysortcriterions.delete);

  // Finish by binding the Primarysortcriterion middleware
  app.param('primarysortcriterionId', primarysortcriterions.primarysortcriterionByID);
};
