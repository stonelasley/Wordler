'use strict';

// Setting up route
angular.module('pages').config(['$stateProvider',
  function ($stateProvider) {
    // Pages state routing
    $stateProvider
      .state('pages', {
        abstract: true,
        url: '/pages',
        template: '<ui-view/>'
      })
      .state('pages.list', {
        url: '',
        templateUrl: 'modules/pages/client/views/list-pages.client.view.html'
      })
      .state('pages.create', {
        url: '/create',
        templateUrl: 'modules/pages/client/views/create-page.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('pages.view', {
        url: '/:pageId',
        templateUrl: 'modules/pages/client/views/view-page.client.view.html'
      })
      .state('pages.edit', {
        url: '/:pageId/edit',
        templateUrl: 'modules/pages/client/views/edit-page.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
