(function () {
  'use strict';

  describe('Primarysortcriterions Route Tests', function () {
    // Initialize global variables
    var $scope,
      PrimarysortcriterionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PrimarysortcriterionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PrimarysortcriterionsService = _PrimarysortcriterionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('primarysortcriterions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/primarysortcriterions');
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
          PrimarysortcriterionsController,
          mockPrimarysortcriterion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('primarysortcriterions.view');
          $templateCache.put('modules/primarysortcriterions/client/views/view-primarysortcriterion.client.view.html', '');

          // create mock Primarysortcriterion
          mockPrimarysortcriterion = new PrimarysortcriterionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Primarysortcriterion Name'
          });

          // Initialize Controller
          PrimarysortcriterionsController = $controller('PrimarysortcriterionsController as vm', {
            $scope: $scope,
            primarysortcriterionResolve: mockPrimarysortcriterion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:primarysortcriterionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.primarysortcriterionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            primarysortcriterionId: 1
          })).toEqual('/primarysortcriterions/1');
        }));

        it('should attach an Primarysortcriterion to the controller scope', function () {
          expect($scope.vm.primarysortcriterion._id).toBe(mockPrimarysortcriterion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/primarysortcriterions/client/views/view-primarysortcriterion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PrimarysortcriterionsController,
          mockPrimarysortcriterion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('primarysortcriterions.create');
          $templateCache.put('modules/primarysortcriterions/client/views/form-primarysortcriterion.client.view.html', '');

          // create mock Primarysortcriterion
          mockPrimarysortcriterion = new PrimarysortcriterionsService();

          // Initialize Controller
          PrimarysortcriterionsController = $controller('PrimarysortcriterionsController as vm', {
            $scope: $scope,
            primarysortcriterionResolve: mockPrimarysortcriterion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.primarysortcriterionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/primarysortcriterions/create');
        }));

        it('should attach an Primarysortcriterion to the controller scope', function () {
          expect($scope.vm.primarysortcriterion._id).toBe(mockPrimarysortcriterion._id);
          expect($scope.vm.primarysortcriterion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/primarysortcriterions/client/views/form-primarysortcriterion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PrimarysortcriterionsController,
          mockPrimarysortcriterion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('primarysortcriterions.edit');
          $templateCache.put('modules/primarysortcriterions/client/views/form-primarysortcriterion.client.view.html', '');

          // create mock Primarysortcriterion
          mockPrimarysortcriterion = new PrimarysortcriterionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Primarysortcriterion Name'
          });

          // Initialize Controller
          PrimarysortcriterionsController = $controller('PrimarysortcriterionsController as vm', {
            $scope: $scope,
            primarysortcriterionResolve: mockPrimarysortcriterion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:primarysortcriterionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.primarysortcriterionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            primarysortcriterionId: 1
          })).toEqual('/primarysortcriterions/1/edit');
        }));

        it('should attach an Primarysortcriterion to the controller scope', function () {
          expect($scope.vm.primarysortcriterion._id).toBe(mockPrimarysortcriterion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/primarysortcriterions/client/views/form-primarysortcriterion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
