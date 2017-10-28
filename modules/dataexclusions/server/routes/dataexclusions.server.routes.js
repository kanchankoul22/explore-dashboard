'use strict';

/**
 * Module dependencies
 */
var dataexclusionsPolicy = require('../policies/dataexclusions.server.policy'),
  dataexclusions = require('../controllers/dataexclusions.server.controller');

module.exports = function(app) {
  // Dataexclusions Routes
  app.route('/api/dataexclusions').all(dataexclusionsPolicy.isAllowed)
    .get(dataexclusions.list)
    .post(dataexclusions.create);

  app.route('/api/dataexclusions/:dataexclusionId').all(dataexclusionsPolicy.isAllowed)
    .get(dataexclusions.read)
    .put(dataexclusions.update)
    .delete(dataexclusions.delete);

  // Finish by binding the Dataexclusion middleware
  app.param('dataexclusionId', dataexclusions.dataexclusionByID);
};
