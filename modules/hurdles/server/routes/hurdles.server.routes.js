'use strict';

/**
 * Module dependencies
 */
var hurdlesPolicy = require('../policies/hurdles.server.policy'),
  hurdles = require('../controllers/hurdles.server.controller');

module.exports = function(app) {
  // Hurdles Routes
  app.route('/api/hurdles').all(hurdlesPolicy.isAllowed)
    .get(hurdles.list)
    .post(hurdles.create);

  app.route('/api/hurdles/:hurdleId').all(hurdlesPolicy.isAllowed)
    .get(hurdles.read)
    .put(hurdles.update)
    .delete(hurdles.delete);

  // Finish by binding the Hurdle middleware
  app.param('hurdleId', hurdles.hurdleByID);
};
