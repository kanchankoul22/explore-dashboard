'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Collectionexclusionlists Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/collectionexclusionlists',
      permissions: '*'
    }, {
      resources: '/api/collectionexclusionlists/:collectionexclusionlistId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/collectionexclusionlists',
      permissions: ['get', 'post']
    }, {
      resources: '/api/collectionexclusionlists/:collectionexclusionlistId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/collectionexclusionlists',
      permissions: ['get']
    }, {
      resources: '/api/collectionexclusionlists/:collectionexclusionlistId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Collectionexclusionlists Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Collectionexclusionlist is being processed and the current user created it then allow any manipulation
  if (req.collectionexclusionlist && req.user && req.collectionexclusionlist.user && req.collectionexclusionlist.user.id === req.user.id) {
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
