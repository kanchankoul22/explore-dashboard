'use strict';

/**
 * Module dependencies
 */
var datafiltersPolicy = require('../policies/datafilters.server.policy'),
  datafilters = require('../controllers/datafilters.server.controller');

module.exports = function(app) {
  // Datafilters Routes
  app.route('/api/datafilters').all(datafiltersPolicy.isAllowed)
    .get(datafilters.list)
    .post(datafilters.create);

  app.route('/api/datafilters/:datafilterId').all(datafiltersPolicy.isAllowed)
    .get(datafilters.read)
    .put(datafilters.update)
    .delete(datafilters.delete);

  // Finish by binding the Datafilter middleware
  app.param('datafilterId', datafilters.datafilterByID);
};
