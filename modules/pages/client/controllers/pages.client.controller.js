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
            });
        };

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

        // Set Chart Data
        $scope.data = [{
            key: "Cumulative Return",
            //values: $scope.page.words
            ///values: [{"k":"the","v":12},{"k":"and","v":12},{"k":"said","v":3},{"k":"top","v":3},{"k":"united","v":2},{"k":"states","v":2},{"k":"will","v":2},{"k":"china","v":2},{"k":"saturday","v":5},{"k":"for","v":4},{"k":"video","v":3},{"k":"southeast","v":2},{"k":"that","v":2},{"k":"was","v":2},{"k":"presidential","v":2},{"k":"such","v":2},{"k":"their","v":2},{"k":"first","v":2},{"k":"they","v":2},{"k":"from","v":3},{"k":"full","v":2},{"k":"news","v":8},{"k":"world","v":2},{"k":"business","v":2},{"k":"reuters","v":3},{"k":"delayed","v":2},{"k":"least","v":2},{"k":"minutes","v":2}]
            values: [
                {"k": "the", "v": 12},
                {"k": "and", "v": 12},
                {"k": "said", "v": 3},
                {"k": "top", "v": 3},
                {
                    "k": "united", "v": 2
                }, {"k": "states", "v": 2}, {"k": "will", "v": 2}, {"k": "china", "v": 2}, {
                    "k": "saturday",
                    "v": 5
                }, {"k": "for", "v": 4}, {"k": "video", "v": 3}, {"k": "southeast", "v": 2}, {
                    "k": "that",
                    "v": 2
                }, {"k": "was", "v": 2}, {"k": "presidential", "v": 2}, {"k": "such", "v": 2}, {
                    "k": "their",
                    "v": 2
                }, {"k": "first", "v": 2}, {"k": "they", "v": 2}, {"k": "from", "v": 3}, {"k": "full", "v": 2}, {
                    "k": "news",
                    "v": 8
                }, {"k": "world", "v": 2}, {"k": "business", "v": 2}, {"k": "reuters", "v": 3}, {
                    "k": "delayed",
                    "v": 2
                }, {"k": "least", "v": 2}, {"k": "minutes", "v": 2}
            ]
        }];


    }
]);
