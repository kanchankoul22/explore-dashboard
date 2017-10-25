(function () {
  'use strict';

  angular
    .module('primarysortcriterions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Primarysortcriterions',
      state: 'primarysortcriterions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'primarysortcriterions', {
      title: 'List Primarysortcriterions',
      state: 'primarysortcriterions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'primarysortcriterions', {
      title: 'Create Primarysortcriterion',
      state: 'primarysortcriterions.create',
      roles: ['user']
    });
  }
}());
