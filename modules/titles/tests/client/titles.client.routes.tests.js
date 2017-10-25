(function () {
  'use strict';

  describe('Titles Route Tests', function () {
    // Initialize global variables
    var $scope,
      TitlesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TitlesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TitlesService = _TitlesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('titles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/titles');
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
          TitlesController,
          mockTitle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('titles.view');
          $templateCache.put('modules/titles/client/views/view-title.client.view.html', '');

          // create mock Title
          mockTitle = new TitlesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Title Name'
          });

          // Initialize Controller
          TitlesController = $controller('TitlesController as vm', {
            $scope: $scope,
            titleResolve: mockTitle
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:titleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.titleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            titleId: 1
          })).toEqual('/titles/1');
        }));

        it('should attach an Title to the controller scope', function () {
          expect($scope.vm.title._id).toBe(mockTitle._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/titles/client/views/view-title.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TitlesController,
          mockTitle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('titles.create');
          $templateCache.put('modules/titles/client/views/form-title.client.view.html', '');

          // create mock Title
          mockTitle = new TitlesService();

          // Initialize Controller
          TitlesController = $controller('TitlesController as vm', {
            $scope: $scope,
            titleResolve: mockTitle
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.titleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/titles/create');
        }));

        it('should attach an Title to the controller scope', function () {
          expect($scope.vm.title._id).toBe(mockTitle._id);
          expect($scope.vm.title._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/titles/client/views/form-title.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TitlesController,
          mockTitle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('titles.edit');
          $templateCache.put('modules/titles/client/views/form-title.client.view.html', '');

          // create mock Title
          mockTitle = new TitlesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Title Name'
          });

          // Initialize Controller
          TitlesController = $controller('TitlesController as vm', {
            $scope: $scope,
            titleResolve: mockTitle
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:titleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.titleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            titleId: 1
          })).toEqual('/titles/1/edit');
        }));

        it('should attach an Title to the controller scope', function () {
          expect($scope.vm.title._id).toBe(mockTitle._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/titles/client/views/form-title.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
