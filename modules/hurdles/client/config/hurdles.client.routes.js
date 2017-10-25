(function () {
  'use strict';

  angular
    .module('hurdles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hurdles', {
        abstract: true,
        url: '/hurdles',
        template: '<ui-view/>'
      })
      .state('hurdles.list', {
        url: '',
        templateUrl: 'modules/hurdles/client/views/list-hurdles.client.view.html',
        controller: 'HurdlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hurdles List'
        }
      })
      .state('hurdles.create', {
        url: '/create',
        templateUrl: 'modules/hurdles/client/views/form-hurdle.client.view.html',
        controller: 'HurdlesController',
        controllerAs: 'vm',
        resolve: {
          hurdleResolve: newHurdle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Hurdles Create'
        }
      })
      .state('hurdles.edit', {
        url: '/:hurdleId/edit',
        templateUrl: 'modules/hurdles/client/views/form-hurdle.client.view.html',
        controller: 'HurdlesController',
        controllerAs: 'vm',
        resolve: {
          hurdleResolve: getHurdle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Hurdle {{ hurdleResolve.name }}'
        }
      })
      .state('hurdles.view', {
        url: '/:hurdleId',
        templateUrl: 'modules/hurdles/client/views/view-hurdle.client.view.html',
        controller: 'HurdlesController',
        controllerAs: 'vm',
        resolve: {
          hurdleResolve: getHurdle
        },
        data: {
          pageTitle: 'Hurdle {{ hurdleResolve.name }}'
        }
      });
  }

  getHurdle.$inject = ['$stateParams', 'HurdlesService'];

  function getHurdle($stateParams, HurdlesService) {
    return HurdlesService.get({
      hurdleId: $stateParams.hurdleId
    }).$promise;
  }

  newHurdle.$inject = ['HurdlesService'];

  function newHurdle(HurdlesService) {
    return new HurdlesService();
  }
}());
