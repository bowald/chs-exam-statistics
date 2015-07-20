angular
  .module('tenta')
  .controller('StatisticCtrl',['$scope','$timeout', '$state', '$stateParams', function($scope, $timeout, $state, $stateParams){

    $scope.rowCollection.some(function (element) {
        if(element['code'] === $stateParams.code){
            $scope.currentCourse = element;
            return true;
        }
    });

    $scope.exampleData = toStatRow($scope.currentCourse.exams);
    console.log($scope.exampleData);

    //FIXME: fix so dates works.

    function toStatRow (exams) {
        var data = [];

        data.push({key: 'notPassed', values: []});
        data.push({key: 'three', values: []});
        data.push({key: 'four', values: []});
        data.push({key: 'five', values: []});

        var i = 0
        exams.forEach(function (exam) {
            for(var key in exam){
                if(exam.hasOwnProperty(key)){
                    if(key !== 'date'){
                        var res = [];
                        var index = i
                        res.push(index);
                        res.push(exam[key]);

                        put(data,key,res);
                    }
                }
            }
            i++;
        });

        return data;
    }

    function put(data,key,value) {
        data.some(function (element) {
            if(element['key'] === key){
                element['values'].push(value);
                return true;
            }
        });
    }

    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            return d3.time.format('%x')(new Date(d));  //uncomment for date format
        }
    };

  }]);