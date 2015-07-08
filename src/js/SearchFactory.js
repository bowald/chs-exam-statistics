angular
    .module('tenta')
    .factory('SearchFactory',['$http', function($http) {

        var factory = {};

        factory.getCourses = function() {
            return $http.get('dummydata/dummy-Courses.json');
        };

        return factory;
}]);