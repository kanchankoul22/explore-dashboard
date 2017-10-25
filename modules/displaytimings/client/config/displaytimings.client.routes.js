(function () {
  'use strict';

  angular
    .module('displaytimings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('displaytimings', {
        abstract: true,
        url: '/displaytimings',
        template: '<ui-view/>'
      })
      .state('displaytimings.list', {
        url: '',
        templateUrl: 'modules/displaytimings/client/views/list-displaytimings.client.view.html',
        controller: 'DisplaytimingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Displaytimings List'
        }
      })
      .state('displaytimings.create', {
        url: '/create',
        templateUrl: 'modules/displaytimings/client/views/form-displaytiming.client.view.html',
        controller: 'DisplaytimingsController',
        controllerAs: 'vm',
        resolve: {
          displaytimingResolve: newDisplaytiming
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Displaytimings Create'
        }
      })
      .state('displaytimings.edit', {
        url: '/:displaytimingId/edit',
        templateUrl: 'modules/displaytimings/client/views/form-displaytiming.client.view.html',
        controller: 'DisplaytimingsController',
        controllerAs: 'vm',
        resolve: {
          displaytimingResolve: getDisplaytiming
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Displaytiming {{ displaytimingResolve.name }}'
        }
      })
      .state('displaytimings.view', {
        url: '/:displaytimingId',
        templateUrl: 'modules/displaytimings/client/views/view-displaytiming.client.view.html',
        controller: 'DisplaytimingsController',
        controllerAs: 'vm',
        resolve: {
          displaytimingResolve: getDisplaytiming
        },
        data: {
          pageTitle: 'Displaytiming {{ displaytimingResolve.name }}'
        }
      });
  }

  getDisplaytiming.$inject = ['$stateParams', 'DisplaytimingsService'];

  function getDisplaytiming($stateParams, DisplaytimingsService) {
    return DisplaytimingsService.get({
      displaytimingId: $stateParams.displaytimingId
    }).$promise;
  }

  newDisplaytiming.$inject = ['DisplaytimingsService'];

  function newDisplaytiming(DisplaytimingsService) {
    return new DisplaytimingsService();
  }
}());
