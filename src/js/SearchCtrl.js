angular
  .module('tenta')
  .controller('SearchCtrl',['$scope','$timeout', '$state', 'SearchFactory', function($scope, $timeout, $state, SeachFactory){

    var downloading = false;

    $scope.$watch('search', function (newVal,oldVal) {
        if(newVal !== oldVal){
            if(newVal.length > 2){
                // Goto start state
                $state.go('search.list');
                getData($scope.search);
            }
            else if (!newVal.length){
                // Goto start state
                $state.go('search');
            }
        }
    },true);

    $scope.stats = function(code) {
        $state.go('search.statistics',{code: code});
    };

    function getData (searchTerm) {
        downloading = true;
        var coursesPromise = SeachFactory.getCourses(searchTerm);

        coursesPromise.then(function(res){
            downloading = false;
            $scope.rowCollection = res.data;
        });

        $scope.displayedCollection = [].concat($scope.rowCollection);
    }
  }]);