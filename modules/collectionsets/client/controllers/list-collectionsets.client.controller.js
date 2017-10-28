(function () {
  'use strict';

  angular
    .module('collectionsets')
    .controller('CollectionsetsListController', CollectionsetsListController);

  CollectionsetsListController.$inject = ['CollectionsetsService'];

  function CollectionsetsListController(CollectionsetsService) {
    var vm = this;

    vm.collectionsets = CollectionsetsService.query();
  }
}());
