(function () {
  'use strict';

  angular
    .module('collections')
    .controller('CollectionsListController', CollectionsListController);

  CollectionsListController.$inject = ['CollectionsService'];

  function CollectionsListController(CollectionsService) {
    var vm = this;

    vm.collections = CollectionsService.query();
    vm.getUrlData = CollectionsService.vendorWithPayment();
  }
}());
