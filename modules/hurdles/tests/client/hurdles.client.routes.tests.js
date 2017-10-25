(function () {
  'use strict';

  describe('Hurdles Route Tests', function () {
    // Initialize global variables
    var $scope,
      HurdlesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HurdlesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HurdlesService = _HurdlesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('hurdles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/hurdles');
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
          HurdlesController,
          mockHurdle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('hurdles.view');
          $templateCache.put('modules/hurdles/client/views/view-hurdle.client.view.html', '');

          // create mock Hurdle
          mockHurdle = new HurdlesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Hurdle Name'
          });

          // Initialize Controller
          HurdlesController = $controller('HurdlesController as vm', {
            $scope: $scope,
            hurdleResolve: mockHurdle
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:hurdleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.hurdleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            hurdleId: 1
          })).toEqual('/hurdles/1');
        }));

        it('should attach an Hurdle to the controller scope', function () {
          expect($scope.vm.hurdle._id).toBe(mockHurdle._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/hurdles/client/views/view-hurdle.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HurdlesController,
          mockHurdle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('hurdles.create');
          $templateCache.put('modules/hurdles/client/views/form-hurdle.client.view.html', '');

          // create mock Hurdle
          mockHurdle = new HurdlesService();

          // Initialize Controller
          HurdlesController = $controller('HurdlesController as vm', {
            $scope: $scope,
            hurdleResolve: mockHurdle
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.hurdleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/hurdles/create');
        }));

        it('should attach an Hurdle to the controller scope', function () {
          expect($scope.vm.hurdle._id).toBe(mockHurdle._id);
          expect($scope.vm.hurdle._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/hurdles/client/views/form-hurdle.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HurdlesController,
          mockHurdle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('hurdles.edit');
          $templateCache.put('modules/hurdles/client/views/form-hurdle.client.view.html', '');

          // create mock Hurdle
          mockHurdle = new HurdlesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Hurdle Name'
          });

          // Initialize Controller
          HurdlesController = $controller('HurdlesController as vm', {
            $scope: $scope,
            hurdleResolve: mockHurdle
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:hurdleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.hurdleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            hurdleId: 1
          })).toEqual('/hurdles/1/edit');
        }));

        it('should attach an Hurdle to the controller scope', function () {
          expect($scope.vm.hurdle._id).toBe(mockHurdle._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/hurdles/client/views/form-hurdle.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
