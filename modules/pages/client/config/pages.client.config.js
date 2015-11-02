'use strict';

// Configuring the Pages module
angular.module('pages').run(['Menus',
  function (Menus) {
    // Add the pages dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Pages',
      state: 'pages',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'pages', {
      title: 'List Pages',
      state: 'pages.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pages', {
      title: 'Create Pages',
      state: 'pages.create',
      roles: ['user']
    });
  }
]);
