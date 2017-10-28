// Dataexclusions service used to communicate Dataexclusions REST endpoints
(function () {
  'use strict';

  angular
    .module('dataexclusions')
    .factory('DataexclusionsService', DataexclusionsService);

  DataexclusionsService.$inject = ['$resource'];

  function DataexclusionsService($resource) {
    return $resource('api/dataexclusions/:dataexclusionId', {
      dataexclusionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
