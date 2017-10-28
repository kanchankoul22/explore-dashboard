// Collectionsets service used to communicate Collectionsets REST endpoints
(function () {
  'use strict';

  angular
    .module('collectionsets')
    .factory('CollectionsetsService', CollectionsetsService);

  CollectionsetsService.$inject = ['$resource'];

  function CollectionsetsService($resource) {
    return $resource('api/collectionsets/:collectionsetId', {
      collectionsetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
