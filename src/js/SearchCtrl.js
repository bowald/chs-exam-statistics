angular
  .module('tenta')
  .controller('SearchCtrl',['$scope','$timeout','SearchFactory', function($scope, $timeout, SeachFactory){

    var searching = false;
    var emptySearch = {
        name: ''
    };

    $scope.search = emptySearch;

    $scope.$watch('search', function () {
        if($scope.search.name.length === 3 && !searching){
            getData($scope.search.name);
        }
        else if ($scope.search.name.length < 3){
            console.log('asdsdasdsdadsa');
            $scope.search = emptySearch;
        }
    },true);

    function getData (searchTerm) {
        searching = true;
        var coursesPromise = SeachFactory.getCourses(searchTerm);

        coursesPromise.then(function(res){
            searching = false;
            var courses = res.data;
            console.log(courses);

            $timeout(function () {
                $scope.$apply(function () {
                    $scope.courses = courses;
                });
            });

        });
    }
  }]);