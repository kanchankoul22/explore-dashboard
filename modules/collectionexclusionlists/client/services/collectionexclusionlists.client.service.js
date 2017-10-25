// Collectionexclusionlists service used to communicate Collectionexclusionlists REST endpoints
(function () {
  'use strict';

  angular
    .module('collectionexclusionlists')
    .factory('CollectionexclusionlistsService', CollectionexclusionlistsService);

  CollectionexclusionlistsService.$inject = ['$resource'];

  function CollectionexclusionlistsService($resource) {
    return $resource('api/collectionexclusionlists/:collectionexclusionlistId', {
      collectionexclusionlistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
