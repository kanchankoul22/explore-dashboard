(function () {
  'use strict';

  // Hurdles controller
  angular
    .module('hurdles')
    .controller('HurdlesController', HurdlesController);

  HurdlesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'hurdleResolve'];

  function HurdlesController ($scope, $state, $window, Authentication, hurdle) {
    var vm = this;

    vm.authentication = Authentication;
    vm.hurdle = hurdle;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hurdle
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.hurdle.$remove($state.go('hurdles.list'));
      }
    }

    // Save Hurdle
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hurdleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.hurdle._id) {
        vm.hurdle.$update(successCallback, errorCallback);
      } else {
        vm.hurdle.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('hurdles.view', {
          hurdleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
