// Criterions service used to communicate Criterions REST endpoints
(function () {
  'use strict';

  angular
    .module('criterions')
    .factory('CriterionsService', CriterionsService);

  CriterionsService.$inject = ['$resource'];

  function CriterionsService($resource) {
    return $resource('api/criterions/:criterionId', {
      criterionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
