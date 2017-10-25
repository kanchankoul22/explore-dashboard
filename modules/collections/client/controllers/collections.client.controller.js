(function () {
  'use strict';

  // Collections controller
  angular
    .module('collections')
    .controller('CollectionsController', CollectionsController);

  CollectionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'collectionResolve'];

  function CollectionsController ($scope, $state, $window, Authentication, collection) {
    var vm = this;

    vm.authentication = Authentication;
    vm.collection = collection;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Collection
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.collection.$remove($state.go('collections.list'));
      }
    }

    // Save Collection
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.collectionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.collection._id) {
        vm.collection.$update(successCallback, errorCallback);
      } else {
        vm.collection.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('collections.view', {
          collectionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
