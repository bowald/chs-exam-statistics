angular
    .module('tenta')
    .factory('SearchFactory',['$http', function($http) {

        var factory = {};

        factory.getCourses = function(searchterm) {
            return $http.get('api/courses', { params:{
                searchterm: searchterm}
            });
        };

        return factory;
}]);