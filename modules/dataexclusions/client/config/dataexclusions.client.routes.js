(function () {
  'use strict';

  angular
    .module('dataexclusions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dataexclusions', {
        abstract: true,
        url: '/dataexclusions',
        template: '<ui-view/>'
      })
      .state('dataexclusions.list', {
        url: '',
        templateUrl: 'modules/dataexclusions/client/views/list-dataexclusions.client.view.html',
        controller: 'DataexclusionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dataexclusions List'
        }
      })
      .state('dataexclusions.create', {
        url: '/create',
        templateUrl: 'modules/dataexclusions/client/views/form-dataexclusion.client.view.html',
        controller: 'DataexclusionsController',
        controllerAs: 'vm',
        resolve: {
          dataexclusionResolve: newDataexclusion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Dataexclusions Create'
        }
      })
      .state('dataexclusions.edit', {
        url: '/:dataexclusionId/edit',
        templateUrl: 'modules/dataexclusions/client/views/form-dataexclusion.client.view.html',
        controller: 'DataexclusionsController',
        controllerAs: 'vm',
        resolve: {
          dataexclusionResolve: getDataexclusion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Dataexclusion {{ dataexclusionResolve.name }}'
        }
      })
      .state('dataexclusions.view', {
        url: '/:dataexclusionId',
        templateUrl: 'modules/dataexclusions/client/views/view-dataexclusion.client.view.html',
        controller: 'DataexclusionsController',
        controllerAs: 'vm',
        resolve: {
          dataexclusionResolve: getDataexclusion
        },
        data: {
          pageTitle: 'Dataexclusion {{ dataexclusionResolve.name }}'
        }
      });
  }

  getDataexclusion.$inject = ['$stateParams', 'DataexclusionsService'];

  function getDataexclusion($stateParams, DataexclusionsService) {
    return DataexclusionsService.get({
      dataexclusionId: $stateParams.dataexclusionId
    }).$promise;
  }

  newDataexclusion.$inject = ['DataexclusionsService'];

  function newDataexclusion(DataexclusionsService) {
    return new DataexclusionsService();
  }
}());
