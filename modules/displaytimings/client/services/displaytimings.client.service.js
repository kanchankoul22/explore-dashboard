// Displaytimings service used to communicate Displaytimings REST endpoints
(function () {
  'use strict';

  angular
    .module('displaytimings')
    .factory('DisplaytimingsService', DisplaytimingsService);

  DisplaytimingsService.$inject = ['$resource'];

  function DisplaytimingsService($resource) {
    return $resource('api/displaytimings/:displaytimingId', {
      displaytimingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
