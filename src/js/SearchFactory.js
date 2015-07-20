'use strict';
angular
    .module('tenta')
    .factory('SearchFactory',['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q) {

        var options = {};
        var cache = $cacheFactory('tentaStatistik', options);

        var factory = {};

        factory.getCourses = function(searchterm) {
            var deferred = $q.defer();

            var cachehit = cache.get(searchterm);

            if(cachehit === undefined){
                console.log('getting from be');
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
                console.log('HIT!!!!!!');
                deferred.resolve(cachehit);
            }

            return deferred.promise;
        };

        return factory;
}]);