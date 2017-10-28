(function () {
  'use strict';

  angular
    .module('dataexclusions')
    .controller('DataexclusionsListController', DataexclusionsListController);

  DataexclusionsListController.$inject = ['DataexclusionsService'];

  function DataexclusionsListController(DataexclusionsService) {
    var vm = this;

    vm.dataexclusions = DataexclusionsService.query();
  }
}());
