(function () {
  'use strict';

  angular
    .module('collectionsets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Collectionsets',
      state: 'collectionsets',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'collectionsets', {
      title: 'List Collectionsets',
      state: 'collectionsets.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'collectionsets', {
      title: 'Create Collectionset',
      state: 'collectionsets.create',
      roles: ['user']
    });
  }
}());
