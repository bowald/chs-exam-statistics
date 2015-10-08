angular
  .module('tenta')
  .controller('StatisticCtrl',['$scope','$timeout', '$state', '$stateParams', function($scope, $timeout, $state, $stateParams){

    // Get all data and puts it in currentCours
    $scope.rowCollection.some(function (element) {
        if(element['code'] === $stateParams.code){
            $scope.currentCourse = element;
            return true;
        }
    });
    var data = extractData($scope.currentCourse.exams);

    data.date = datasToString(data.date);
    console.log(data);
    $scope.legend = true;
    $scope.series = ['U','3','4','5'];
    $scope.labels = data.date;
    $scope.data = [data.notPassed, data.three, data.four, data.five];
    $scope.colors = ['#F03118','#A9D63F','#8AB029','#5C7E0E'];

    function extractData(exams){
        sortedExams = sortByDates(exams);

        var data = {
            'date' : [],
            'notPassed' : [],
            'three' : [],
            'four' : [],
            'five' : []
        };

        sortedExams.forEach(function (exam) {
            for(var key in exam){
                if(exam.hasOwnProperty(key)){
                    data[key].push(exam[key]);
                }
            }
        });

        return data;
    }

    function sortByDates(exams){
        return exams.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });
    }

    function datasToString(dates){
        var labels = [];
        dates.forEach(function (date) {
            var d = new Date(date);
            var yyyy = d.getFullYear().toString();
            var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
            var dd  = d.getDate().toString();
            labels.push(yyyy + '-' + (mm[1]?mm:'0'+mm[0]) + '-' + (dd[1]?dd:'0'+dd[0]));
        });

        return labels;
    }




  }]);