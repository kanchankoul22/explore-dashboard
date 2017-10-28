(function () {
  'use strict';

  describe('Dataexclusions Route Tests', function () {
    // Initialize global variables
    var $scope,
      DataexclusionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DataexclusionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DataexclusionsService = _DataexclusionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('dataexclusions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/dataexclusions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DataexclusionsController,
          mockDataexclusion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('dataexclusions.view');
          $templateCache.put('modules/dataexclusions/client/views/view-dataexclusion.client.view.html', '');

          // create mock Dataexclusion
          mockDataexclusion = new DataexclusionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Dataexclusion Name'
          });

          // Initialize Controller
          DataexclusionsController = $controller('DataexclusionsController as vm', {
            $scope: $scope,
            dataexclusionResolve: mockDataexclusion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:dataexclusionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.dataexclusionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            dataexclusionId: 1
          })).toEqual('/dataexclusions/1');
        }));

        it('should attach an Dataexclusion to the controller scope', function () {
          expect($scope.vm.dataexclusion._id).toBe(mockDataexclusion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/dataexclusions/client/views/view-dataexclusion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DataexclusionsController,
          mockDataexclusion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('dataexclusions.create');
          $templateCache.put('modules/dataexclusions/client/views/form-dataexclusion.client.view.html', '');

          // create mock Dataexclusion
          mockDataexclusion = new DataexclusionsService();

          // Initialize Controller
          DataexclusionsController = $controller('DataexclusionsController as vm', {
            $scope: $scope,
            dataexclusionResolve: mockDataexclusion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.dataexclusionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/dataexclusions/create');
        }));

        it('should attach an Dataexclusion to the controller scope', function () {
          expect($scope.vm.dataexclusion._id).toBe(mockDataexclusion._id);
          expect($scope.vm.dataexclusion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/dataexclusions/client/views/form-dataexclusion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DataexclusionsController,
          mockDataexclusion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('dataexclusions.edit');
          $templateCache.put('modules/dataexclusions/client/views/form-dataexclusion.client.view.html', '');

          // create mock Dataexclusion
          mockDataexclusion = new DataexclusionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Dataexclusion Name'
          });

          // Initialize Controller
          DataexclusionsController = $controller('DataexclusionsController as vm', {
            $scope: $scope,
            dataexclusionResolve: mockDataexclusion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:dataexclusionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.dataexclusionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            dataexclusionId: 1
          })).toEqual('/dataexclusions/1/edit');
        }));

        it('should attach an Dataexclusion to the controller scope', function () {
          expect($scope.vm.dataexclusion._id).toBe(mockDataexclusion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/dataexclusions/client/views/form-dataexclusion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
