angular
  .module('tenta')
  .controller('SearchCtrl',['$scope','$timeout', '$state', 'SearchFactory', function($scope, $timeout, $state, SeachFactory){

    // TODO: Should be use to animate backend request
    var downloading = false;

    $scope.$watch('search', function (newVal,oldVal) {
        if(newVal !== oldVal){
            if(newVal.length > 2){

                getData($scope.search);

                // Goto "list all fetched courses" state
                $state.go('search.list');
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