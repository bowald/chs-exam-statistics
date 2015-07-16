angular
  .module('tenta')
  .controller('SearchCtrl',['$scope','$timeout', '$state', 'SearchFactory', function($scope, $timeout, $state, SeachFactory){

    var searching = false;
    var emptySearch = {
        name: ''
    };

    $scope.search = emptySearch;

    $scope.$watch('search', function () {
        if($scope.search.name.length === 3 && !searching){
            $state.go('search.list');
            getData($scope.search.name);
        }
        else if ($scope.search.name.length < 3){
            console.log('please kill');
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.courses = [];
                });
            });
        }
    },true);

    $scope.stats = function(code) {
        $state.go('search.statistics',{code: code});
        console.log(code);
    };

    function getData (searchTerm) {
        searching = true;
        var coursesPromise = SeachFactory.getCourses(searchTerm);

        coursesPromise.then(function(res){
            searching = false;
            $scope.rowCollection = res.data;
        });

        $scope.displayedCollection = [].concat($scope.rowCollection);
    }
  }]);