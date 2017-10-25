(function () {
  'use strict';

  angular
    .module('collectionexclusionlists')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('collectionexclusionlists', {
        abstract: true,
        url: '/collectionexclusionlists',
        template: '<ui-view/>'
      })
      .state('collectionexclusionlists.list', {
        url: '',
        templateUrl: 'modules/collectionexclusionlists/client/views/list-collectionexclusionlists.client.view.html',
        controller: 'CollectionexclusionlistsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Collectionexclusionlists List'
        }
      })
      .state('collectionexclusionlists.create', {
        url: '/create',
        templateUrl: 'modules/collectionexclusionlists/client/views/form-collectionexclusionlist.client.view.html',
        controller: 'CollectionexclusionlistsController',
        controllerAs: 'vm',
        resolve: {
          collectionexclusionlistResolve: newCollectionexclusionlist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Collectionexclusionlists Create'
        }
      })
      .state('collectionexclusionlists.edit', {
        url: '/:collectionexclusionlistId/edit',
        templateUrl: 'modules/collectionexclusionlists/client/views/form-collectionexclusionlist.client.view.html',
        controller: 'CollectionexclusionlistsController',
        controllerAs: 'vm',
        resolve: {
          collectionexclusionlistResolve: getCollectionexclusionlist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Collectionexclusionlist {{ collectionexclusionlistResolve.name }}'
        }
      })
      .state('collectionexclusionlists.view', {
        url: '/:collectionexclusionlistId',
        templateUrl: 'modules/collectionexclusionlists/client/views/view-collectionexclusionlist.client.view.html',
        controller: 'CollectionexclusionlistsController',
        controllerAs: 'vm',
        resolve: {
          collectionexclusionlistResolve: getCollectionexclusionlist
        },
        data: {
          pageTitle: 'Collectionexclusionlist {{ collectionexclusionlistResolve.name }}'
        }
      });
  }

  getCollectionexclusionlist.$inject = ['$stateParams', 'CollectionexclusionlistsService'];

  function getCollectionexclusionlist($stateParams, CollectionexclusionlistsService) {
    return CollectionexclusionlistsService.get({
      collectionexclusionlistId: $stateParams.collectionexclusionlistId
    }).$promise;
  }

  newCollectionexclusionlist.$inject = ['CollectionexclusionlistsService'];

  function newCollectionexclusionlist(CollectionexclusionlistsService) {
    return new CollectionexclusionlistsService();
  }
}());
