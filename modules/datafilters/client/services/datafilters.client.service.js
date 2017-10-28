// Datafilters service used to communicate Datafilters REST endpoints
(function () {
  'use strict';

  angular
    .module('datafilters')
    .factory('DatafiltersService', DatafiltersService);

  DatafiltersService.$inject = ['$resource'];

  function DatafiltersService($resource) {
    return $resource('api/datafilters/:datafilterId', {
      datafilterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
