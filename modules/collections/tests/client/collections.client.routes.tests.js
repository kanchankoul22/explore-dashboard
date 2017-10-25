(function () {
  'use strict';

  describe('Collections Route Tests', function () {
    // Initialize global variables
    var $scope,
      CollectionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CollectionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CollectionsService = _CollectionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('collections');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/collections');
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
          CollectionsController,
          mockCollection;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('collections.view');
          $templateCache.put('modules/collections/client/views/view-collection.client.view.html', '');

          // create mock Collection
          mockCollection = new CollectionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Collection Name'
          });

          // Initialize Controller
          CollectionsController = $controller('CollectionsController as vm', {
            $scope: $scope,
            collectionResolve: mockCollection
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:collectionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.collectionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            collectionId: 1
          })).toEqual('/collections/1');
        }));

        it('should attach an Collection to the controller scope', function () {
          expect($scope.vm.collection._id).toBe(mockCollection._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/collections/client/views/view-collection.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CollectionsController,
          mockCollection;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('collections.create');
          $templateCache.put('modules/collections/client/views/form-collection.client.view.html', '');

          // create mock Collection
          mockCollection = new CollectionsService();

          // Initialize Controller
          CollectionsController = $controller('CollectionsController as vm', {
            $scope: $scope,
            collectionResolve: mockCollection
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.collectionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/collections/create');
        }));

        it('should attach an Collection to the controller scope', function () {
          expect($scope.vm.collection._id).toBe(mockCollection._id);
          expect($scope.vm.collection._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/collections/client/views/form-collection.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CollectionsController,
          mockCollection;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('collections.edit');
          $templateCache.put('modules/collections/client/views/form-collection.client.view.html', '');

          // create mock Collection
          mockCollection = new CollectionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Collection Name'
          });

          // Initialize Controller
          CollectionsController = $controller('CollectionsController as vm', {
            $scope: $scope,
            collectionResolve: mockCollection
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:collectionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.collectionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            collectionId: 1
          })).toEqual('/collections/1/edit');
        }));

        it('should attach an Collection to the controller scope', function () {
          expect($scope.vm.collection._id).toBe(mockCollection._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/collections/client/views/form-collection.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
