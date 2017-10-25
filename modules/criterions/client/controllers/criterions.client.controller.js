(function () {
  'use strict';

  // Criterions controller
  angular
    .module('criterions')
    .controller('CriterionsController', CriterionsController);

  CriterionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'criterionResolve'];

  function CriterionsController ($scope, $state, $window, Authentication, criterion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.criterion = criterion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Criterion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.criterion.$remove($state.go('criterions.list'));
      }
    }

    // Save Criterion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.criterionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.criterion._id) {
        vm.criterion.$update(successCallback, errorCallback);
      } else {
        vm.criterion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('criterions.view', {
          criterionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
