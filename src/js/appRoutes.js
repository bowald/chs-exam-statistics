angular
  .module('appRoutes',[])
  .config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider){

    $routeProvider

      .when('/', {
        templateUrl: 'views/course.html'
        // controller: 'SearchCtrl'
      });


    $locationProvider.html5Mode(true);

  }]);