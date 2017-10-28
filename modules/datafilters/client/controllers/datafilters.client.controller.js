(function () {
  'use strict';

  // Datafilters controller
  angular
    .module('datafilters')
    .controller('DatafiltersController', DatafiltersController);

  DatafiltersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'datafilterResolve'];

  function DatafiltersController ($scope, $state, $window, Authentication, datafilter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.datafilter = datafilter;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.criterias = [
      { type : 'id' },
      { type : 'cuisines' },
      { type : 'characterstics' },
      { type : 'chains' },
      { type : 'payment type' }
      
    ];



    $scope.changeme = function() {
      alert('here');
    };
    // Remove existing Datafilter
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.datafilter.$remove($state.go('datafilters.list'));
      }
    }

    // Save Datafilter
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.datafilterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.datafilter._id) {
        vm.datafilter.$update(successCallback, errorCallback);
      } else {
        vm.datafilter.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('datafilters.view', {
          datafilterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
