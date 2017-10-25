'use strict';

/**
 * Module dependencies
 */
var displaytimingsPolicy = require('../policies/displaytimings.server.policy'),
  displaytimings = require('../controllers/displaytimings.server.controller');

module.exports = function(app) {
  // Displaytimings Routes
  app.route('/api/displaytimings').all(displaytimingsPolicy.isAllowed)
    .get(displaytimings.list)
    .post(displaytimings.create);

  app.route('/api/displaytimings/:displaytimingId').all(displaytimingsPolicy.isAllowed)
    .get(displaytimings.read)
    .put(displaytimings.update)
    .delete(displaytimings.delete);

  // Finish by binding the Displaytiming middleware
  app.param('displaytimingId', displaytimings.displaytimingByID);
};
