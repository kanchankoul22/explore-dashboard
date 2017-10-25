(function () {
  'use strict';

  describe('Collectionexclusionlists Controller Tests', function () {
    // Initialize global variables
    var CollectionexclusionlistsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CollectionexclusionlistsService,
      mockCollectionexclusionlist;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CollectionexclusionlistsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CollectionexclusionlistsService = _CollectionexclusionlistsService_;

      // create mock Collectionexclusionlist
      mockCollectionexclusionlist = new CollectionexclusionlistsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Collectionexclusionlist Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Collectionexclusionlists controller.
      CollectionexclusionlistsController = $controller('CollectionexclusionlistsController as vm', {
        $scope: $scope,
        collectionexclusionlistResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCollectionexclusionlistPostData;

      beforeEach(function () {
        // Create a sample Collectionexclusionlist object
        sampleCollectionexclusionlistPostData = new CollectionexclusionlistsService({
          name: 'Collectionexclusionlist Name'
        });

        $scope.vm.collectionexclusionlist = sampleCollectionexclusionlistPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CollectionexclusionlistsService) {
        // Set POST response
        $httpBackend.expectPOST('api/collectionexclusionlists', sampleCollectionexclusionlistPostData).respond(mockCollectionexclusionlist);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Collectionexclusionlist was created
        expect($state.go).toHaveBeenCalledWith('collectionexclusionlists.view', {
          collectionexclusionlistId: mockCollectionexclusionlist._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/collectionexclusionlists', sampleCollectionexclusionlistPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Collectionexclusionlist in $scope
        $scope.vm.collectionexclusionlist = mockCollectionexclusionlist;
      });

      it('should update a valid Collectionexclusionlist', inject(function (CollectionexclusionlistsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/collectionexclusionlists\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('collectionexclusionlists.view', {
          collectionexclusionlistId: mockCollectionexclusionlist._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CollectionexclusionlistsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/collectionexclusionlists\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Collectionexclusionlists
        $scope.vm.collectionexclusionlist = mockCollectionexclusionlist;
      });

      it('should delete the Collectionexclusionlist and redirect to Collectionexclusionlists', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/collectionexclusionlists\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('collectionexclusionlists.list');
      });

      it('should should not delete the Collectionexclusionlist and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
