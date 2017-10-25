// Titles service used to communicate Titles REST endpoints
(function () {
  'use strict';

  angular
    .module('titles')
    .factory('TitlesService', TitlesService);

  TitlesService.$inject = ['$resource'];

  function TitlesService($resource) {
    return $resource('api/titles/:titleId', {
      titleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
