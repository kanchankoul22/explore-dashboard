(function () {
  'use strict';

  angular
    .module('datafilters')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Datafilters',
      state: 'datafilters',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'datafilters', {
      title: 'List Datafilters',
      state: 'datafilters.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'datafilters', {
      title: 'Create Datafilter',
      state: 'datafilters.create',
      roles: ['user']
    });
  }
}());
