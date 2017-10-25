(function () {
  'use strict';

  describe('Collectionexclusionlists Route Tests', function () {
    // Initialize global variables
    var $scope,
      CollectionexclusionlistsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CollectionexclusionlistsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CollectionexclusionlistsService = _CollectionexclusionlistsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('collectionexclusionlists');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/collectionexclusionlists');
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
          CollectionexclusionlistsController,
          mockCollectionexclusionlist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('collectionexclusionlists.view');
          $templateCache.put('modules/collectionexclusionlists/client/views/view-collectionexclusionlist.client.view.html', '');

          // create mock Collectionexclusionlist
          mockCollectionexclusionlist = new CollectionexclusionlistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Collectionexclusionlist Name'
          });

          // Initialize Controller
          CollectionexclusionlistsController = $controller('CollectionexclusionlistsController as vm', {
            $scope: $scope,
            collectionexclusionlistResolve: mockCollectionexclusionlist
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:collectionexclusionlistId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.collectionexclusionlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            collectionexclusionlistId: 1
          })).toEqual('/collectionexclusionlists/1');
        }));

        it('should attach an Collectionexclusionlist to the controller scope', function () {
          expect($scope.vm.collectionexclusionlist._id).toBe(mockCollectionexclusionlist._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/collectionexclusionlists/client/views/view-collectionexclusionlist.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CollectionexclusionlistsController,
          mockCollectionexclusionlist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('collectionexclusionlists.create');
          $templateCache.put('modules/collectionexclusionlists/client/views/form-collectionexclusionlist.client.view.html', '');

          // create mock Collectionexclusionlist
          mockCollectionexclusionlist = new CollectionexclusionlistsService();

          // Initialize Controller
          CollectionexclusionlistsController = $controller('CollectionexclusionlistsController as vm', {
            $scope: $scope,
            collectionexclusionlistResolve: mockCollectionexclusionlist
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.collectionexclusionlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/collectionexclusionlists/create');
        }));

        it('should attach an Collectionexclusionlist to the controller scope', function () {
          expect($scope.vm.collectionexclusionlist._id).toBe(mockCollectionexclusionlist._id);
          expect($scope.vm.collectionexclusionlist._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/collectionexclusionlists/client/views/form-collectionexclusionlist.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CollectionexclusionlistsController,
          mockCollectionexclusionlist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('collectionexclusionlists.edit');
          $templateCache.put('modules/collectionexclusionlists/client/views/form-collectionexclusionlist.client.view.html', '');

          // create mock Collectionexclusionlist
          mockCollectionexclusionlist = new CollectionexclusionlistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Collectionexclusionlist Name'
          });

          // Initialize Controller
          CollectionexclusionlistsController = $controller('CollectionexclusionlistsController as vm', {
            $scope: $scope,
            collectionexclusionlistResolve: mockCollectionexclusionlist
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:collectionexclusionlistId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.collectionexclusionlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            collectionexclusionlistId: 1
          })).toEqual('/collectionexclusionlists/1/edit');
        }));

        it('should attach an Collectionexclusionlist to the controller scope', function () {
          expect($scope.vm.collectionexclusionlist._id).toBe(mockCollectionexclusionlist._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/collectionexclusionlists/client/views/form-collectionexclusionlist.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
