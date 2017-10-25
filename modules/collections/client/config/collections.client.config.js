(function () {
  'use strict';

  angular
    .module('collections')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Collections',
      state: 'collections',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'collections', {
      title: 'List Collections',
      state: 'collections.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'collections', {
      title: 'Create Collection',
      state: 'collections.create',
      roles: ['user']
    });
  }
}());
