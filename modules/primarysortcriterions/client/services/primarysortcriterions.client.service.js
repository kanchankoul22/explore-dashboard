// Primarysortcriterions service used to communicate Primarysortcriterions REST endpoints
(function () {
  'use strict';

  angular
    .module('primarysortcriterions')
    .factory('PrimarysortcriterionsService', PrimarysortcriterionsService);

  PrimarysortcriterionsService.$inject = ['$resource'];

  function PrimarysortcriterionsService($resource) {
    return $resource('api/primarysortcriterions/:primarysortcriterionId', {
      primarysortcriterionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
