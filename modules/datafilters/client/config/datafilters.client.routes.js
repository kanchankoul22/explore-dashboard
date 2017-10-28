(function () {
  'use strict';

  angular
    .module('datafilters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('datafilters', {
        abstract: true,
        url: '/datafilters',
        template: '<ui-view/>'
      })
      .state('datafilters.list', {
        url: '',
        templateUrl: 'modules/datafilters/client/views/list-datafilters.client.view.html',
        controller: 'DatafiltersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Datafilters List'
        }
      })
      .state('datafilters.create', {
        url: '/create',
        templateUrl: 'modules/datafilters/client/views/form-datafilter.client.view.html',
        controller: 'DatafiltersController',
        controllerAs: 'vm',
        resolve: {
          datafilterResolve: newDatafilter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Datafilters Create'
        }
      })
      .state('datafilters.edit', {
        url: '/:datafilterId/edit',
        templateUrl: 'modules/datafilters/client/views/form-datafilter.client.view.html',
        controller: 'DatafiltersController',
        controllerAs: 'vm',
        resolve: {
          datafilterResolve: getDatafilter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Datafilter {{ datafilterResolve.name }}'
        }
      })
      .state('datafilters.view', {
        url: '/:datafilterId',
        templateUrl: 'modules/datafilters/client/views/view-datafilter.client.view.html',
        controller: 'DatafiltersController',
        controllerAs: 'vm',
        resolve: {
          datafilterResolve: getDatafilter
        },
        data: {
          pageTitle: 'Datafilter {{ datafilterResolve.name }}'
        }
      });
  }

  getDatafilter.$inject = ['$stateParams', 'DatafiltersService'];

  function getDatafilter($stateParams, DatafiltersService) {
    return DatafiltersService.get({
      datafilterId: $stateParams.datafilterId
    }).$promise;
  }

  newDatafilter.$inject = ['DatafiltersService'];

  function newDatafilter(DatafiltersService) {
    return new DatafiltersService();
  }
}());
