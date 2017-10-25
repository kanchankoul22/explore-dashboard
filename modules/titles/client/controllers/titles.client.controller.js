(function () {
  'use strict';

  // Titles controller
  angular
    .module('titles')
    .controller('TitlesController', TitlesController);

  TitlesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'titleResolve'];

  function TitlesController ($scope, $state, $window, Authentication, title) {
    var vm = this;

    vm.authentication = Authentication;
    vm.title = title;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Title
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.title.$remove($state.go('titles.list'));
      }
    }

    // Save Title
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.titleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.title._id) {
        vm.title.$update(successCallback, errorCallback);
      } else {
        vm.title.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('titles.view', {
          titleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
