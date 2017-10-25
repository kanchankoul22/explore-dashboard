(function () {
  'use strict';

  // Collectionexclusionlists controller
  angular
    .module('collectionexclusionlists')
    .controller('CollectionexclusionlistsController', CollectionexclusionlistsController);

  CollectionexclusionlistsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'collectionexclusionlistResolve'];

  function CollectionexclusionlistsController ($scope, $state, $window, Authentication, collectionexclusionlist) {
    var vm = this;

    vm.authentication = Authentication;
    vm.collectionexclusionlist = collectionexclusionlist;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Collectionexclusionlist
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.collectionexclusionlist.$remove($state.go('collectionexclusionlists.list'));
      }
    }

    // Save Collectionexclusionlist
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.collectionexclusionlistForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.collectionexclusionlist._id) {
        vm.collectionexclusionlist.$update(successCallback, errorCallback);
      } else {
        vm.collectionexclusionlist.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('collectionexclusionlists.view', {
          collectionexclusionlistId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
