(function () {
  'use strict';

  angular
    .module('datafilters')
    .controller('DatafiltersListController', DatafiltersListController);

  DatafiltersListController.$inject = ['DatafiltersService', '$scope', 'moment' ,'$window'];

  function DatafiltersListController(DatafiltersService, $scope, moment, $window) {
    var vm = this;
    vm.remove = remove;
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    vm.changeTimezone = function (date) {
      return moment(date).utcOffset('+05:30').format('HH:mm:ss a');
    };
    
    vm.datafilters = DatafiltersService.query();
    function remove(datafilters) {
      if ($window.confirm('Are you sure you want to delete?')) {
        datafilters.$remove(function () {
          vm.datafilters = DatafiltersService.query();
        });
      }
    }
    
  }
}());
