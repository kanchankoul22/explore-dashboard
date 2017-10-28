'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Dataexclusions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/dataexclusions',
      permissions: '*'
    }, {
      resources: '/api/dataexclusions/:dataexclusionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/dataexclusions',
      permissions: ['get', 'post']
    }, {
      resources: '/api/dataexclusions/:dataexclusionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/dataexclusions',
      permissions: ['get']
    }, {
      resources: '/api/dataexclusions/:dataexclusionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Dataexclusions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Dataexclusion is being processed and the current user created it then allow any manipulation
  if (req.dataexclusion && req.user && req.dataexclusion.user && req.dataexclusion.user.id === req.user.id) {
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
