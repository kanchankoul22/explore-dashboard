(function () {
  'use strict';

  describe('Dataexclusions Controller Tests', function () {
    // Initialize global variables
    var DataexclusionsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      DataexclusionsService,
      mockDataexclusion;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _DataexclusionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      DataexclusionsService = _DataexclusionsService_;

      // create mock Dataexclusion
      mockDataexclusion = new DataexclusionsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Dataexclusion Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Dataexclusions controller.
      DataexclusionsController = $controller('DataexclusionsController as vm', {
        $scope: $scope,
        dataexclusionResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleDataexclusionPostData;

      beforeEach(function () {
        // Create a sample Dataexclusion object
        sampleDataexclusionPostData = new DataexclusionsService({
          name: 'Dataexclusion Name'
        });

        $scope.vm.dataexclusion = sampleDataexclusionPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (DataexclusionsService) {
        // Set POST response
        $httpBackend.expectPOST('api/dataexclusions', sampleDataexclusionPostData).respond(mockDataexclusion);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Dataexclusion was created
        expect($state.go).toHaveBeenCalledWith('dataexclusions.view', {
          dataexclusionId: mockDataexclusion._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/dataexclusions', sampleDataexclusionPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Dataexclusion in $scope
        $scope.vm.dataexclusion = mockDataexclusion;
      });

      it('should update a valid Dataexclusion', inject(function (DataexclusionsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/dataexclusions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('dataexclusions.view', {
          dataexclusionId: mockDataexclusion._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (DataexclusionsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/dataexclusions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Dataexclusions
        $scope.vm.dataexclusion = mockDataexclusion;
      });

      it('should delete the Dataexclusion and redirect to Dataexclusions', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/dataexclusions\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('dataexclusions.list');
      });

      it('should should not delete the Dataexclusion and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
