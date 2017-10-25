(function () {
  'use strict';

  angular
    .module('collections')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('collections', {
        abstract: true,
        url: '/collections',
        template: '<ui-view/>'
      })
      .state('collections.list', {
        url: '',
        templateUrl: 'modules/collections/client/views/list-collections.client.view.html',
        controller: 'CollectionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Collections List'
        }
      })
      .state('collections.create', {
        url: '/create',
        templateUrl: 'modules/collections/client/views/form-collection.client.view.html',
        controller: 'CollectionsController',
        controllerAs: 'vm',
        resolve: {
          collectionResolve: newCollection
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Collections Create'
        }
      })
      .state('collections.edit', {
        url: '/:collectionId/edit',
        templateUrl: 'modules/collections/client/views/form-collection.client.view.html',
        controller: 'CollectionsController',
        controllerAs: 'vm',
        resolve: {
          collectionResolve: getCollection
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Collection {{ collectionResolve.name }}'
        }
      })
      .state('collections.view', {
        url: '/:collectionId',
        templateUrl: 'modules/collections/client/views/view-collection.client.view.html',
        controller: 'CollectionsController',
        controllerAs: 'vm',
        resolve: {
          collectionResolve: getCollection
        },
        data: {
          pageTitle: 'Collection {{ collectionResolve.name }}'
        }
      });
  }

  getCollection.$inject = ['$stateParams', 'CollectionsService'];

  function getCollection($stateParams, CollectionsService) {
    return CollectionsService.get({
      collectionId: $stateParams.collectionId
    }).$promise;
  }

  newCollection.$inject = ['CollectionsService'];

  function newCollection(CollectionsService) {
    return new CollectionsService();
  }
}());
