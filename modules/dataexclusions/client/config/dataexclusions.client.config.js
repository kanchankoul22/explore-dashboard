(function () {
  'use strict';

  angular
    .module('dataexclusions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Dataexclusions',
      state: 'dataexclusions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'dataexclusions', {
      title: 'List Dataexclusions',
      state: 'dataexclusions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'dataexclusions', {
      title: 'Create Dataexclusion',
      state: 'dataexclusions.create',
      roles: ['user']
    });
  }
}());
