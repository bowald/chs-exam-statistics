angular
    .module('tenta')
    .factory('SearchFactory',['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q) {
        // Module used to fetch data from backend.
        // Once the data is fetched it will be stored on local machine during the session using cacheFactory
        // Each backend request is paired with the search term(usually the first three letters) or course code.


        var options = {};
        var cache = $cacheFactory('tentaStatistik', options);

        var factory = {};

        factory.getCourses = function(searchterm) {
            var deferred = $q.defer();

            var cachehit = cache.get(searchterm);

            if(cachehit === undefined){
                $http
                    .get('api/courses', {
                        params:{
                            searchterm: searchterm
                        }
                    })

                    .then(
                        function (res) {
                            var result = typeof res === 'undefined' ? null : res;
                            cache.put(searchterm, result);

                            deferred.resolve(result);
                        },
                        function (err) {
                            deferred.reject(err);
                        }
                    );
            }
            else{
                deferred.resolve(cachehit);
            }

            return deferred.promise;
        };

        return factory;
}]);