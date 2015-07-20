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

    $scope.exampleData = [
        {
            "key": "Series 1",
            "values": [ [ new Date('2014-09-12') , 1] , [ new Date('2014-09-13') , 5] , [ new Date('2014-09-15') , 3] , [ new Date('2014-09-19') , 1]]
        },
        {
            "key": "Series 2",
            "values": [ [ new Date('2014-09-12') , 0] , [ new Date('2014-09-13') , 0] , [ new Date('2014-09-15') , 0] , [ new Date('2014-09-19') , 0]]
       },
       {
           "key": "Series 3",
           "values": [ [ new Date('2014-09-12') , 0] , [ new Date('2014-09-13') , 8] , [ new Date('2014-09-15') , 20] , [ new Date('2014-09-19') , 10]]
       },
       {
           "key": "Series 4",
           "values": [ [ new Date('2014-09-12') , 3] , [ new Date('2014-09-13') , 1] , [ new Date('2014-09-15') , 2] , [ new Date('2014-09-19') , 5]]
         }
     ];


  $scope.chartObject = {
    "type": "AreaChart",
    "displayed": true,
    "data": {
      "cols": [
        {
          "id": "month",
          "label": "Month",
          "type": "string",
          "p": {}
        },
        {
          "id": "laptop-id",
          "label": "Laptop",
          "type": "number",
          "p": {}
        },
        {
          "id": "desktop-id",
          "label": "Desktop",
          "type": "number",
          "p": {}
        },
        {
          "id": "server-id",
          "label": "Server",
          "type": "number",
          "p": {}
        },
        {
          "id": "cost-id",
          "label": "Shipping",
          "type": "number"
        }
      ],
      "rows": [
        {
          "c": [
            {
              "v": "January"
            },
            {
              "v": 19,
              "f": "42 items"
            },
            {
              "v": 12,
              "f": "Ony 12 items"
            },
            {
              "v": 7,
              "f": "7 servers"
            },
            {
              "v": 4
            }
          ]
        },
        {
          "c": [
            {
              "v": "February"
            },
            {
              "v": 13
            },
            {
              "v": 1,
              "f": "1 unit (Out of stock this month)"
            },
            {
              "v": 12
            },
            {
              "v": 2
            }
          ]
        },
        {
          "c": [
            {
              "v": "March"
            },
            {
              "v": 24
            },
            {
              "v": 5
            },
            {
              "v": 11
            },
            {
              "v": 6
            }
          ]
        }
      ]
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

    // $timeout(function () {
    //     $scope.$apply(function () {
    //         var rows = toStatRow($scope.currentCourse.exams);
    //         $scope.chartObject = {
    //       "type": "AreaChart",
    //       "displayed": true,
    //       "data": {
    //         "cols": [
    //         {
    //             "id": "date",
    //             "label": "Date",
    //             "type": "string",
    //             "p": {}
    //           },
    //           {
    //             "id": "0",
    //             "label": "Not Passed",
    //             "type": "string",
    //             "p": {}
    //           },
    //           {
    //             "id": "3",
    //             "label": "3",
    //             "type": "number",
    //             "p": {}
    //           },
    //           {
    //             "id": "4",
    //             "label": "4",
    //             "type": "number",
    //             "p": {}
    //           },
    //           {
    //             "id": "5",
    //             "label": "5",
    //             "type": "number",
    //             "p": {}
    //           }
    //         ],
    //         "rows": rows.splice(4,21)
    //       },
    //       "options": {
    //         "title": "Sales per month",
    //         "isStacked": "true",
    //         "fill": 20,
    //         "displayExactValues": true,
    //         "vAxis": {
    //           "title": "Sales unit",
    //           "gridlines": {
    //             "count": 10
    //           }
    //         },
    //         "hAxis": {
    //           "title": "Date"
    //         }
    //       },
    //       "formatters": {}
    //     }
    //     });
    //     console.log($scope.chartObject);
    // });
  }]);