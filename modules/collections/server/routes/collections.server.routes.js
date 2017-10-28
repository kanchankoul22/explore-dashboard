'use strict';

/**
 * Module dependencies
 */
var collectionsPolicy = require('../policies/collections.server.policy'),
  collections = require('../controllers/collections.server.controller');

module.exports = function(app) {
  // Collections Routes
  app.route('/api/collections').all(collectionsPolicy.isAllowed)
    .get(collections.list)
    .post(collections.create);

  app.route('/api/collections/:collectionId').all(collectionsPolicy.isAllowed)
    .get(collections.read)
    .put(collections.update)
    .delete(collections.delete);

      
  // Finish by binding the Collection middleware
  app.param('collectionId', collections.collectionByID);

};
