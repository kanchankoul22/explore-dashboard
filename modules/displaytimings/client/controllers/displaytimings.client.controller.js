(function () {
  'use strict';

  // Displaytimings controller
  angular
    .module('displaytimings')
    .controller('DisplaytimingsController', DisplaytimingsController);

  DisplaytimingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'displaytimingResolve'];

  function DisplaytimingsController ($scope, $state, $window, Authentication, displaytiming) {
    var vm = this;

    vm.authentication = Authentication;
    vm.displaytiming = displaytiming;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Displaytiming
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.displaytiming.$remove($state.go('displaytimings.list'));
      }
    }

    // Save Displaytiming
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.displaytimingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.displaytiming._id) {
        vm.displaytiming.$update(successCallback, errorCallback);
      } else {
        vm.displaytiming.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('displaytimings.view', {
          displaytimingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
