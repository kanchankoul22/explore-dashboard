(function () {
  'use strict';

  angular
    .module('hurdles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Hurdles',
      state: 'hurdles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'hurdles', {
      title: 'List Hurdles',
      state: 'hurdles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'hurdles', {
      title: 'Create Hurdle',
      state: 'hurdles.create',
      roles: ['user']
    });
  }
}());
