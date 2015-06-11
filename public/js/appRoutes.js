angular.module('appRoutes',[]).config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider){

  $routeProvider
  
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })

    .when('/course', {
      templateUrl: 'views/course.html',
      controller: 'CourseController'
    });

  $locationProvider.html5Mode(true);

}]);