(function () {
  'use strict';

  angular
    .module('displaytimings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Displaytimings',
      state: 'displaytimings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'displaytimings', {
      title: 'List Displaytimings',
      state: 'displaytimings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'displaytimings', {
      title: 'Create Displaytiming',
      state: 'displaytimings.create',
      roles: ['user']
    });
  }
}());
