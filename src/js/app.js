angular
    .module('tenta', [
        'ui.router','smart-table', 'chart.js'
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
            });

    })

    .run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
        // Send info to analytics
        $rootScope
            .$on('$stateChangeSuccess',
                function(event){

                    if (!$window.ga)
                        return;

                    $window.ga('send', 'pageview', { page: $location.path() });
            });
    }]);
