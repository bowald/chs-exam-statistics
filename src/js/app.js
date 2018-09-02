require('../less/chs-exam-statistics.less')

import angular from 'angular';
import 'angular-ui-router';
import 'angular-smart-table';
import 'angular-chart.js';
import 'angular-ui-bootstrap';

/**
 * chs-exam-statistics
 * @version v1.0.0
 * @link https://github.com/bowald/chs-exam-statistics
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

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

require('./StatisticCtrl')
require('./SearchFactory')
require('./SearchCtrl')
require('./google-analytics')