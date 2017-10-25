(function () {
  'use strict';

  angular
    .module('titles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Titles',
      state: 'titles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'titles', {
      title: 'List Titles',
      state: 'titles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'titles', {
      title: 'Create Title',
      state: 'titles.create',
      roles: ['user']
    });
  }
}());
