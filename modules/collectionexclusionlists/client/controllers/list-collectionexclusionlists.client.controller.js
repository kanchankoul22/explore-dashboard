(function () {
  'use strict';

  angular
    .module('collectionexclusionlists')
    .controller('CollectionexclusionlistsListController', CollectionexclusionlistsListController);

  CollectionexclusionlistsListController.$inject = ['CollectionexclusionlistsService'];

  function CollectionexclusionlistsListController(CollectionexclusionlistsService) {
    var vm = this;

    vm.collectionexclusionlists = CollectionexclusionlistsService.query();
  }
}());
