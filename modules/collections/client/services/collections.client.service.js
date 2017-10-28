// Collections service used to communicate Collections REST endpoints
(function () {
  'use strict';

  angular
    .module('collections')
    .factory('CollectionsService', CollectionsService);

  CollectionsService.$inject = ['$resource'];

  function CollectionsService($resource) {
    return $resource('api/collections/:collectionId', {
      collectionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      
    });
  }
}());
