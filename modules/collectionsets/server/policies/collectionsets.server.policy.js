'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Collectionsets Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/collectionsets',
      permissions: '*'
    }, {
      resources: '/api/collectionsets/:collectionsetId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/collectionsets',
      permissions: ['get', 'post']
    }, {
      resources: '/api/collectionsets/:collectionsetId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/collectionsets',
      permissions: ['get']
    }, {
      resources: '/api/collectionsets/:collectionsetId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Collectionsets Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Collectionset is being processed and the current user created it then allow any manipulation
  if (req.collectionset && req.user && req.collectionset.user && req.collectionset.user.id === req.user.id) {
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
