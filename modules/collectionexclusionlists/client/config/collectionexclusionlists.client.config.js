(function () {
  'use strict';

  angular
    .module('collectionexclusionlists')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Collectionexclusionlists',
      state: 'collectionexclusionlists',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'collectionexclusionlists', {
      title: 'List Collectionexclusionlists',
      state: 'collectionexclusionlists.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'collectionexclusionlists', {
      title: 'Create Collectionexclusionlist',
      state: 'collectionexclusionlists.create',
      roles: ['user']
    });
  }
}());
