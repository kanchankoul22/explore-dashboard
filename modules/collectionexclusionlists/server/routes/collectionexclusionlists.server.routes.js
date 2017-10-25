'use strict';

/**
 * Module dependencies
 */
var collectionexclusionlistsPolicy = require('../policies/collectionexclusionlists.server.policy'),
  collectionexclusionlists = require('../controllers/collectionexclusionlists.server.controller');

module.exports = function(app) {
  // Collectionexclusionlists Routes
  app.route('/api/collectionexclusionlists').all(collectionexclusionlistsPolicy.isAllowed)
    .get(collectionexclusionlists.list)
    .post(collectionexclusionlists.create);

  app.route('/api/collectionexclusionlists/:collectionexclusionlistId').all(collectionexclusionlistsPolicy.isAllowed)
    .get(collectionexclusionlists.read)
    .put(collectionexclusionlists.update)
    .delete(collectionexclusionlists.delete);

  // Finish by binding the Collectionexclusionlist middleware
  app.param('collectionexclusionlistId', collectionexclusionlists.collectionexclusionlistByID);
};
