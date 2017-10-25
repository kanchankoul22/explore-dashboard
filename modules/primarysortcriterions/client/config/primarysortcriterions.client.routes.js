(function () {
  'use strict';

  angular
    .module('primarysortcriterions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('primarysortcriterions', {
        abstract: true,
        url: '/primarysortcriterions',
        template: '<ui-view/>'
      })
      .state('primarysortcriterions.list', {
        url: '',
        templateUrl: 'modules/primarysortcriterions/client/views/list-primarysortcriterions.client.view.html',
        controller: 'PrimarysortcriterionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Primarysortcriterions List'
        }
      })
      .state('primarysortcriterions.create', {
        url: '/create',
        templateUrl: 'modules/primarysortcriterions/client/views/form-primarysortcriterion.client.view.html',
        controller: 'PrimarysortcriterionsController',
        controllerAs: 'vm',
        resolve: {
          primarysortcriterionResolve: newPrimarysortcriterion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Primarysortcriterions Create'
        }
      })
      .state('primarysortcriterions.edit', {
        url: '/:primarysortcriterionId/edit',
        templateUrl: 'modules/primarysortcriterions/client/views/form-primarysortcriterion.client.view.html',
        controller: 'PrimarysortcriterionsController',
        controllerAs: 'vm',
        resolve: {
          primarysortcriterionResolve: getPrimarysortcriterion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Primarysortcriterion {{ primarysortcriterionResolve.name }}'
        }
      })
      .state('primarysortcriterions.view', {
        url: '/:primarysortcriterionId',
        templateUrl: 'modules/primarysortcriterions/client/views/view-primarysortcriterion.client.view.html',
        controller: 'PrimarysortcriterionsController',
        controllerAs: 'vm',
        resolve: {
          primarysortcriterionResolve: getPrimarysortcriterion
        },
        data: {
          pageTitle: 'Primarysortcriterion {{ primarysortcriterionResolve.name }}'
        }
      });
  }

  getPrimarysortcriterion.$inject = ['$stateParams', 'PrimarysortcriterionsService'];

  function getPrimarysortcriterion($stateParams, PrimarysortcriterionsService) {
    return PrimarysortcriterionsService.get({
      primarysortcriterionId: $stateParams.primarysortcriterionId
    }).$promise;
  }

  newPrimarysortcriterion.$inject = ['PrimarysortcriterionsService'];

  function newPrimarysortcriterion(PrimarysortcriterionsService) {
    return new PrimarysortcriterionsService();
  }
}());
