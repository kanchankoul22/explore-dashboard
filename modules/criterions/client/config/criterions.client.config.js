(function () {
  'use strict';

  angular
    .module('criterions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Criterions',
      state: 'criterions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'criterions', {
      title: 'List Criterions',
      state: 'criterions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'criterions', {
      title: 'Create Criterion',
      state: 'criterions.create',
      roles: ['user']
    });
  }
}());
