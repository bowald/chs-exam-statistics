angular
    .module('tenta', [
        'ui.router','smart-table'
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
                url: '/statistics/:course',
                templateUrl: 'views/search.statistics.html'
                // controller: 'statisticsCtrl'
            });

    });