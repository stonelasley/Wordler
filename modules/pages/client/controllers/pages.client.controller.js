'use strict';

// Pages controller
angular.module('pages').controller('PagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pages',
  function ($scope, $stateParams, $location, Authentication, Pages) {
    $scope.authentication = Authentication;

    // Create new Page
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'pageForm');

        return false;
      }

      // Create new Page object
      var page = new Pages({
        url: this.url,
        note: this.note
      });

      // Redirect after save
      page.$save(function (response) {
        $location.path('pages/' + response._id);

        // Clear form fields
        $scope.url = '';
        $scope.note = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Page
    $scope.remove = function (page) {
      if (page) {
        page.$remove();

        for (var i in $scope.pages) {
          if ($scope.pages[i] === page) {
            $scope.pages.splice(i, 1);
          }
        }
      } else {
        $scope.page.$remove(function () {
          $location.path('pages');
        });
      }
    };

    // Update existing Page
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'pageForm');

        return false;
      }

      var page = $scope.page;

      page.$update(function () {
        $location.path('pages/' + page._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Pages
    $scope.find = function () {
      $scope.pages = Pages.query();
    };

    // Find existing Page
    $scope.findOne = function () {
      $scope.page = Pages.get({
        pageId: $stateParams.pageId
      }, function () {
        $scope.data[0].values = JSON.parse($scope.page.words);
        $scope.api.refresh();
      });
    };

    // Set Chart Data
    $scope.data = [{
      key: "Cumulative Return",
      values: []
    }];
    // Set Chart Options
    $scope.options = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function (d) {
          return d.k;
        },
        y: function (d) {
          return d.v;
        },
        showValues: true,
        valueFormat: function (d) {
          //return d3.format('d')(d);
          return d;
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'Word',
          rotateLabels: 30
        },
        yAxis: {
          axisLabel: 'Occurence',
          axisLabelDistance: -10
        }
      }
    };
  }
]);
