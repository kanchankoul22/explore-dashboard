'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
  function ($scope,$state, Authentication) {
    // This provides Authentication context.
    
    $scope.authentication = Authentication;
    console.log("called",$scope.authentication);
    if($scope.authentication.user){
      $state.go('collections.list');
    }
    else{
      $state.go('authentication.signin');
    }
  }
]);
