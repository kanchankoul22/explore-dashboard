(function () {
  'use strict';

  describe('Datafilters Route Tests', function () {
    // Initialize global variables
    var $scope,
      DatafiltersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DatafiltersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DatafiltersService = _DatafiltersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('datafilters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/datafilters');
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
          DatafiltersController,
          mockDatafilter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('datafilters.view');
          $templateCache.put('modules/datafilters/client/views/view-datafilter.client.view.html', '');

          // create mock Datafilter
          mockDatafilter = new DatafiltersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Datafilter Name'
          });

          // Initialize Controller
          DatafiltersController = $controller('DatafiltersController as vm', {
            $scope: $scope,
            datafilterResolve: mockDatafilter
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:datafilterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.datafilterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            datafilterId: 1
          })).toEqual('/datafilters/1');
        }));

        it('should attach an Datafilter to the controller scope', function () {
          expect($scope.vm.datafilter._id).toBe(mockDatafilter._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/datafilters/client/views/view-datafilter.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DatafiltersController,
          mockDatafilter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('datafilters.create');
          $templateCache.put('modules/datafilters/client/views/form-datafilter.client.view.html', '');

          // create mock Datafilter
          mockDatafilter = new DatafiltersService();

          // Initialize Controller
          DatafiltersController = $controller('DatafiltersController as vm', {
            $scope: $scope,
            datafilterResolve: mockDatafilter
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.datafilterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/datafilters/create');
        }));

        it('should attach an Datafilter to the controller scope', function () {
          expect($scope.vm.datafilter._id).toBe(mockDatafilter._id);
          expect($scope.vm.datafilter._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/datafilters/client/views/form-datafilter.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DatafiltersController,
          mockDatafilter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('datafilters.edit');
          $templateCache.put('modules/datafilters/client/views/form-datafilter.client.view.html', '');

          // create mock Datafilter
          mockDatafilter = new DatafiltersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Datafilter Name'
          });

          // Initialize Controller
          DatafiltersController = $controller('DatafiltersController as vm', {
            $scope: $scope,
            datafilterResolve: mockDatafilter
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:datafilterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.datafilterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            datafilterId: 1
          })).toEqual('/datafilters/1/edit');
        }));

        it('should attach an Datafilter to the controller scope', function () {
          expect($scope.vm.datafilter._id).toBe(mockDatafilter._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/datafilters/client/views/form-datafilter.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
