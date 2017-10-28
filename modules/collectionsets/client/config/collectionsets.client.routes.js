(function () {
  'use strict';

  angular
    .module('collectionsets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('collectionsets', {
        abstract: true,
        url: '/collectionsets',
        template: '<ui-view/>'
      })
      .state('collectionsets.list', {
        url: '',
        templateUrl: 'modules/collectionsets/client/views/list-collectionsets.client.view.html',
        controller: 'CollectionsetsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Collectionsets List'
        }
      })
      .state('collectionsets.create', {
        url: '/create',
        templateUrl: 'modules/collectionsets/client/views/form-collectionset.client.view.html',
        controller: 'CollectionsetsController',
        controllerAs: 'vm',
        resolve: {
          collectionsetResolve: newCollectionset
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Collectionsets Create'
        }
      })
      .state('collectionsets.edit', {
        url: '/:collectionsetId/edit',
        templateUrl: 'modules/collectionsets/client/views/form-collectionset.client.view.html',
        controller: 'CollectionsetsController',
        controllerAs: 'vm',
        resolve: {
          collectionsetResolve: getCollectionset
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Collectionset {{ collectionsetResolve.name }}'
        }
      })
      .state('collectionsets.view', {
        url: '/:collectionsetId',
        templateUrl: 'modules/collectionsets/client/views/view-collectionset.client.view.html',
        controller: 'CollectionsetsController',
        controllerAs: 'vm',
        resolve: {
          collectionsetResolve: getCollectionset
        },
        data: {
          pageTitle: 'Collectionset {{ collectionsetResolve.name }}'
        }
      });
  }

  getCollectionset.$inject = ['$stateParams', 'CollectionsetsService'];

  function getCollectionset($stateParams, CollectionsetsService) {
    return CollectionsetsService.get({
      collectionsetId: $stateParams.collectionsetId
    }).$promise;
  }

  newCollectionset.$inject = ['CollectionsetsService'];

  function newCollectionset(CollectionsetsService) {
    return new CollectionsetsService();
  }
}());
