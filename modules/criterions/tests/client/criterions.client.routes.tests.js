(function () {
  'use strict';

  describe('Criterions Route Tests', function () {
    // Initialize global variables
    var $scope,
      CriterionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CriterionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CriterionsService = _CriterionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('criterions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/criterions');
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
          CriterionsController,
          mockCriterion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('criterions.view');
          $templateCache.put('modules/criterions/client/views/view-criterion.client.view.html', '');

          // create mock Criterion
          mockCriterion = new CriterionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Criterion Name'
          });

          // Initialize Controller
          CriterionsController = $controller('CriterionsController as vm', {
            $scope: $scope,
            criterionResolve: mockCriterion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:criterionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.criterionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            criterionId: 1
          })).toEqual('/criterions/1');
        }));

        it('should attach an Criterion to the controller scope', function () {
          expect($scope.vm.criterion._id).toBe(mockCriterion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/criterions/client/views/view-criterion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CriterionsController,
          mockCriterion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('criterions.create');
          $templateCache.put('modules/criterions/client/views/form-criterion.client.view.html', '');

          // create mock Criterion
          mockCriterion = new CriterionsService();

          // Initialize Controller
          CriterionsController = $controller('CriterionsController as vm', {
            $scope: $scope,
            criterionResolve: mockCriterion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.criterionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/criterions/create');
        }));

        it('should attach an Criterion to the controller scope', function () {
          expect($scope.vm.criterion._id).toBe(mockCriterion._id);
          expect($scope.vm.criterion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/criterions/client/views/form-criterion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CriterionsController,
          mockCriterion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('criterions.edit');
          $templateCache.put('modules/criterions/client/views/form-criterion.client.view.html', '');

          // create mock Criterion
          mockCriterion = new CriterionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Criterion Name'
          });

          // Initialize Controller
          CriterionsController = $controller('CriterionsController as vm', {
            $scope: $scope,
            criterionResolve: mockCriterion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:criterionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.criterionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            criterionId: 1
          })).toEqual('/criterions/1/edit');
        }));

        it('should attach an Criterion to the controller scope', function () {
          expect($scope.vm.criterion._id).toBe(mockCriterion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/criterions/client/views/form-criterion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
