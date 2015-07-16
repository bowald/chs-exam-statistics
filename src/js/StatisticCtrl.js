angular
  .module('tenta')
  .controller('StatisticCtrl',['$scope','$timeout', '$state', '$stateParams', function($scope, $timeout, $state, $stateParams){

    $scope.rowCollection.some(function (element) {
        if(element['code'] === $stateParams.code){
            $scope.currentCourse = element;
            return true;
        }
    });

    function toStatRow (exams) {
        var rows = [];
        exams.forEach(function (exam) {
            var c = [];
            var date = new Date(exam.date).getMonth() +  '/' + new Date(exam.date).getFullYear();
            c[0] = {v: date};
            c[1] = {v: exam.notPassed};
            c[2] = {v: exam.three};
            c[3] = {v: exam.four};
            c[4] = {v: exam.five};

            rows.push({c: c});
        });

        return rows;
    }


    $timeout(function () {
        $scope.$apply(function () {
            var rows = toStatRow($scope.currentCourse.exams);
            $scope.chartObject = {
          "type": "AreaChart",
          "displayed": true,
          "data": {
            "cols": [
            {
                "id": "date",
                "label": "Date",
                "type": "string",
                "p": {}
              },
              {
                "id": "0",
                "label": "Not Passed",
                "type": "string",
                "p": {}
              },
              {
                "id": "3",
                "label": "3",
                "type": "number",
                "p": {}
              },
              {
                "id": "4",
                "label": "4",
                "type": "number",
                "p": {}
              },
              {
                "id": "5",
                "label": "5",
                "type": "number",
                "p": {}
              }
            ],
            "rows": rows.splice(4,21)
          },
          "options": {
            "title": "Sales per month",
            "isStacked": "true",
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
              "title": "Sales unit",
              "gridlines": {
                "count": 10
              }
            },
            "hAxis": {
              "title": "Date"
            }
          },
          "formatters": {}
        }
        });
        console.log($scope.chartObject);
    });
  }]);