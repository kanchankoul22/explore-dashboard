(function () {
  'use strict';

  // Dataexclusions controller
  angular
    .module('dataexclusions')
    .controller('DataexclusionsController', DataexclusionsController);

  DataexclusionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'dataexclusionResolve'];

  function DataexclusionsController ($scope, $state, $window, Authentication, dataexclusion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.dataexclusion = dataexclusion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Dataexclusion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.dataexclusion.$remove($state.go('dataexclusions.list'));
      }
    }

    // Save Dataexclusion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dataexclusionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.dataexclusion._id) {
        vm.dataexclusion.$update(successCallback, errorCallback);
      } else {
        vm.dataexclusion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('dataexclusions.view', {
          dataexclusionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
