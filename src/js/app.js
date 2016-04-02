angular
    .module('tenta', [
        'ui.router','smart-table', 'chart.js', 'ui.bootstrap'
    ])

    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/search");

        $stateProvider
            .state('search',{
                url: '/search',
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })

            .state('search.list', {
                url: '/list',
                templateUrl: 'views/search.list.html'
            })

            .state('search.statistics', {
                url: '/statistics/:code',
                templateUrl: 'views/search.statistics.html',
                controller: 'StatisticCtrl'
            })

            .state('search.statistics.chart', {
                url: '/chart',
                templateUrl: 'views/search.statistics.chart.html'
            })

            .state('search.statistics.percentage', {
                url: '/percentage',
                templateUrl: 'views/search.statistics.percentage.html'
            });
    })

    .run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
        // Send info to Google analytics
        $rootScope
            .$on('$stateChangeSuccess',
                function(event){

                    if (!$window.ga)
                        return;

                    $window.ga('send', 'pageview', { page: $location.path() });
            });
    }]);
