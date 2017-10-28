(function () {
  'use strict';

  angular
    .module('collections')
    .controller('CollectionsListController', CollectionsListController);

  CollectionsListController.$inject = ['CollectionsService','$window'];

  function CollectionsListController(CollectionsService, $window) {
    var vm = this;
    vm.remove = remove;
    vm.collections = CollectionsService.query();
    // vm.getUrlData = CollectionsService.vendorWithPayment();
    
    function remove(collections) {
      if ($window.confirm('Are you sure you want to delete?')) {
        collections.$remove(function () {
          vm.collections = CollectionsService.query();
        });
      }
    }
  }
}());
