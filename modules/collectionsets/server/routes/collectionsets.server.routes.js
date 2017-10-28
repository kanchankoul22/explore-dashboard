'use strict';

/**
 * Module dependencies
 */
var collectionsetsPolicy = require('../policies/collectionsets.server.policy'),
  collectionsets = require('../controllers/collectionsets.server.controller');

module.exports = function(app) {
  // Collectionsets Routes
  app.route('/api/collectionsets').all(collectionsetsPolicy.isAllowed)
    .get(collectionsets.list)
    .post(collectionsets.create);

  app.route('/api/collectionsets/:collectionsetId').all(collectionsetsPolicy.isAllowed)
    .get(collectionsets.read)
    .put(collectionsets.update)
    .delete(collectionsets.delete);

  // Finish by binding the Collectionset middleware
  app.param('collectionsetId', collectionsets.collectionsetByID);
};
