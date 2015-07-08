angular
  .module('tenta',[])
  .controller('SeatchController',['SeachFactory', function(SeachFactory){

    var coursesPromise = SeachFactory.getCourses();

    coursesPromise.then(function(res){
        $scope.courses = res.data;
    });

  }]);