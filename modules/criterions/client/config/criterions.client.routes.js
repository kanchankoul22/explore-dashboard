(function () {
  'use strict';

  angular
    .module('criterions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('criterions', {
        abstract: true,
        url: '/criterions',
        template: '<ui-view/>'
      })
      .state('criterions.list', {
        url: '',
        templateUrl: 'modules/criterions/client/views/list-criterions.client.view.html',
        controller: 'CriterionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Criterions List'
        }
      })
      .state('criterions.create', {
        url: '/create',
        templateUrl: 'modules/criterions/client/views/form-criterion.client.view.html',
        controller: 'CriterionsController',
        controllerAs: 'vm',
        resolve: {
          criterionResolve: newCriterion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Criterions Create'
        }
      })
      .state('criterions.edit', {
        url: '/:criterionId/edit',
        templateUrl: 'modules/criterions/client/views/form-criterion.client.view.html',
        controller: 'CriterionsController',
        controllerAs: 'vm',
        resolve: {
          criterionResolve: getCriterion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Criterion {{ criterionResolve.name }}'
        }
      })
      .state('criterions.view', {
        url: '/:criterionId',
        templateUrl: 'modules/criterions/client/views/view-criterion.client.view.html',
        controller: 'CriterionsController',
        controllerAs: 'vm',
        resolve: {
          criterionResolve: getCriterion
        },
        data: {
          pageTitle: 'Criterion {{ criterionResolve.name }}'
        }
      });
  }

  getCriterion.$inject = ['$stateParams', 'CriterionsService'];

  function getCriterion($stateParams, CriterionsService) {
    return CriterionsService.get({
      criterionId: $stateParams.criterionId
    }).$promise;
  }

  newCriterion.$inject = ['CriterionsService'];

  function newCriterion(CriterionsService) {
    return new CriterionsService();
  }
}());
