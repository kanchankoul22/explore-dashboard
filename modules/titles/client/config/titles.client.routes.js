(function () {
  'use strict';

  angular
    .module('titles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('titles', {
        abstract: true,
        url: '/titles',
        template: '<ui-view/>'
      })
      .state('titles.list', {
        url: '',
        templateUrl: 'modules/titles/client/views/list-titles.client.view.html',
        controller: 'TitlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Titles List'
        }
      })
      .state('titles.create', {
        url: '/create',
        templateUrl: 'modules/titles/client/views/form-title.client.view.html',
        controller: 'TitlesController',
        controllerAs: 'vm',
        resolve: {
          titleResolve: newTitle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Titles Create'
        }
      })
      .state('titles.edit', {
        url: '/:titleId/edit',
        templateUrl: 'modules/titles/client/views/form-title.client.view.html',
        controller: 'TitlesController',
        controllerAs: 'vm',
        resolve: {
          titleResolve: getTitle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Title {{ titleResolve.name }}'
        }
      })
      .state('titles.view', {
        url: '/:titleId',
        templateUrl: 'modules/titles/client/views/view-title.client.view.html',
        controller: 'TitlesController',
        controllerAs: 'vm',
        resolve: {
          titleResolve: getTitle
        },
        data: {
          pageTitle: 'Title {{ titleResolve.name }}'
        }
      });
  }

  getTitle.$inject = ['$stateParams', 'TitlesService'];

  function getTitle($stateParams, TitlesService) {
    return TitlesService.get({
      titleId: $stateParams.titleId
    }).$promise;
  }

  newTitle.$inject = ['TitlesService'];

  function newTitle(TitlesService) {
    return new TitlesService();
  }
}());
