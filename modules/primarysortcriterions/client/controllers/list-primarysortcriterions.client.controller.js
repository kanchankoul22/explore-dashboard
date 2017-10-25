(function () {
  'use strict';

  angular
    .module('primarysortcriterions')
    .controller('PrimarysortcriterionsListController', PrimarysortcriterionsListController);

  PrimarysortcriterionsListController.$inject = ['PrimarysortcriterionsService'];

  function PrimarysortcriterionsListController(PrimarysortcriterionsService) {
    var vm = this;

    vm.primarysortcriterions = PrimarysortcriterionsService.query();
  }
}());
