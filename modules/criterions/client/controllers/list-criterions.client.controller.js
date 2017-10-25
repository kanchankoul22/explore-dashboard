(function () {
  'use strict';

  angular
    .module('criterions')
    .controller('CriterionsListController', CriterionsListController);

  CriterionsListController.$inject = ['CriterionsService'];

  function CriterionsListController(CriterionsService) {
    var vm = this;

    vm.criterions = CriterionsService.query();
  }
}());
