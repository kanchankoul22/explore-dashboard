(function () {
  'use strict';

  angular
    .module('displaytimings')
    .controller('DisplaytimingsListController', DisplaytimingsListController);

  DisplaytimingsListController.$inject = ['DisplaytimingsService'];

  function DisplaytimingsListController(DisplaytimingsService) {
    var vm = this;

    vm.displaytimings = DisplaytimingsService.query();
  }
}());
