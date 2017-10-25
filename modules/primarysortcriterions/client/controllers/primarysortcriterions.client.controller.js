(function () {
  'use strict';

  // Primarysortcriterions controller
  angular
    .module('primarysortcriterions')
    .controller('PrimarysortcriterionsController', PrimarysortcriterionsController);

  PrimarysortcriterionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'primarysortcriterionResolve'];

  function PrimarysortcriterionsController ($scope, $state, $window, Authentication, primarysortcriterion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.primarysortcriterion = primarysortcriterion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Primarysortcriterion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.primarysortcriterion.$remove($state.go('primarysortcriterions.list'));
      }
    }

    // Save Primarysortcriterion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.primarysortcriterionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.primarysortcriterion._id) {
        vm.primarysortcriterion.$update(successCallback, errorCallback);
      } else {
        vm.primarysortcriterion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('primarysortcriterions.view', {
          primarysortcriterionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
