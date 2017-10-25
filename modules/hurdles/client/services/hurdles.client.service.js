// Hurdles service used to communicate Hurdles REST endpoints
(function () {
  'use strict';

  angular
    .module('hurdles')
    .factory('HurdlesService', HurdlesService);

  HurdlesService.$inject = ['$resource'];

  function HurdlesService($resource) {
    return $resource('api/hurdles/:hurdleId', {
      hurdleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
