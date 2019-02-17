angular
  .module('tenta')
  .controller('StatisticCtrl',['$scope','$timeout', '$state', '$stateParams', 'SearchFactory', function($scope, $timeout, $state, $stateParams, SearchFactory){
    // Controller that shows details for a specific course

    // Get all data and puts it in currentCours
    getCurrentCourse($stateParams.code, $scope.rowCollection);

    // Tool tips
    $scope.avgGradeTip = 'Average grade based on average result of only passing students.';
    $scope.avgFailRateTip = 'Average fail rate based on the average of fails per exam.';

    $scope.isShowPercentage = $state.current.name == "search.statistics.percentage";
    $scope.togglePercentage = function () {
        if($state.current.name == "search.statistics.percentage"){$state.go('search.statistics.chart');}
        else{$state.go('search.statistics.percentage')}

    }
   
    function gradePercentage(grade, total) {
        return total > 0 ? Math.round(grade / total * 1000) / 10 : 0;
    }

    function calculatePercentage(dates, notPassed,threes,fours,fives) {
        var exames = [];
        for (i = 0; i < dates.length; i++) {
            percentage = {};

            var totalOnExam = notPassed[i] + threes[i] + fours[i] + fives[i];
            percentage.notPassed = gradePercentage(notPassed[i], totalOnExam);
            percentage.threes = gradePercentage(threes[i], totalOnExam);
            percentage.fours = gradePercentage(fours[i], totalOnExam);
            percentage.fives = gradePercentage(fives[i], totalOnExam);
            percentage.totalOnExam = totalOnExam;
            percentage.date = dates[i];

            exames.push(percentage);
        }
        return exames;
    }

    function getCurrentCourse(code, collection) {
        // If the user uses URL directly to Statistic-page
        if(typeof collection === 'undefined'){
            var promise = SearchFactory.getCourses(code);
            promise.then(function (res) {
                dateToScope (code, res.data);
            });
        }
        else{
                dateToScope (code, collection);
        }
    }

    function dateToScope (code, collection) {
        $scope.currentCourse = getCourseFromCollection(code, collection);

        calculateAvrage($scope.currentCourse.exams);

        var data = extractData($scope.currentCourse.exams);

        // Data used for the diagram
        data.date = datesToString(data.date);

        // Diagram options
        $scope.legend = true;
        $scope.series = ['U','3','4','5'];
        $scope.labels = data.date;
        $scope.colors = ['#F03118','#A9D63F','#8AB029','#5C7E0E'];

        // Different types of data
        $scope.quantities = [data.notPassed, data.three, data.four, data.five]
        $scope.percantageCollection = calculatePercentage(data.date, data.notPassed, data.three, data.four, data.five);
        // console.log($scope.percantageCollection)
        // data in diagram
        $scope.data = $scope.quantities;

    }

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

    function datesToString(dates){
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

    function getCourseFromCollection (code, collection) {
        var course;
        collection.some(function (element) {
            if(element['code'] === code){
                course = element;
                return true;
            }
        });

        return course;
    }

    function calculateAvrage (exams) {
        var students = 0;
        var totGrade = 0;
        var totFails = 0;
        var passedStudents = 0;
        var examFailRate = 0;
        exams.forEach(function (exam) {
            var students = exam.three + exam.four + exam.five + exam.notPassed
            examFailRate += students > 0 ? exam.notPassed / students : 0;
            totGrade += exam.three * 3 + exam.four * 4 + exam.five * 5;
            passedStudents += exam.three + exam.four + exam.five;
        });

        if(passedStudents != 0){
            $scope.average = Math.round(totGrade/passedStudents * 100) / 100;
        }
        else {
            $scope.average = "-";
        }

        $scope.averageFailRate = Math.round((examFailRate/exams.length) * 100); //Convert to procent
        $scope.numOfStudens = students;
    }


  }]);