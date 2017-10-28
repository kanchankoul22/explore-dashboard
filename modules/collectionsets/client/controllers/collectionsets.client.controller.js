(function () {
  'use strict';

  // Collectionsets controller
  angular
    .module('collectionsets')
    .controller('CollectionsetsController', CollectionsetsController);

  CollectionsetsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'collectionsetResolve'];

  function CollectionsetsController ($scope, $state, $window, Authentication, collectionset) {
    var vm = this;

    vm.authentication = Authentication;
    vm.collectionset = collectionset;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Collectionset
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.collectionset.$remove($state.go('collectionsets.list'));
      }
    }

    // Save Collectionset
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.collectionsetForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.collectionset._id) {
        vm.collectionset.$update(successCallback, errorCallback);
      } else {
        vm.collectionset.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('collectionsets.view', {
          collectionsetId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
