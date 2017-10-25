(function () {
  'use strict';

  angular
    .module('hurdles')
    .controller('HurdlesListController', HurdlesListController);

  HurdlesListController.$inject = ['HurdlesService'];

  function HurdlesListController(HurdlesService) {
    var vm = this;

    vm.hurdles = HurdlesService.query();
  }
}());
