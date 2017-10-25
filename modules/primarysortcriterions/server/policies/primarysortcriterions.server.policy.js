'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Primarysortcriterions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/primarysortcriterions',
      permissions: '*'
    }, {
      resources: '/api/primarysortcriterions/:primarysortcriterionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/primarysortcriterions',
      permissions: ['get', 'post']
    }, {
      resources: '/api/primarysortcriterions/:primarysortcriterionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/primarysortcriterions',
      permissions: ['get']
    }, {
      resources: '/api/primarysortcriterions/:primarysortcriterionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Primarysortcriterions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Primarysortcriterion is being processed and the current user created it then allow any manipulation
  if (req.primarysortcriterion && req.user && req.primarysortcriterion.user && req.primarysortcriterion.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
