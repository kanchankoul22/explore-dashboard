(function () {
  'use strict';

  angular
    .module('titles')
    .controller('TitlesListController', TitlesListController);

  TitlesListController.$inject = ['TitlesService'];

  function TitlesListController(TitlesService) {
    var vm = this;

    vm.titles = TitlesService.query();
  }
}());
