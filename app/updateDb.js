
var XLSX = require('xlsx'),
    HashMap = require('hashmap'),
    fs = require('fs');

var OUTPUTPATH = __dirname +'/courses.json',
    INPUTPATH = __dirname + '/Statistik_over_kursresultat-2.xlsx';


var gradeToKey = function (grade){
    if (grade == 3) return 'three';
    else if (grade == 4) return 'four';
    else if (grade == 5) return 'five';
    else if (grade == 'U') return 'notPassed';
    else return 'undefined';
};

var SaveToFile = function(collection){
    fs.writeFile(OUTPUTPATH, JSON.stringify(collection, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + OUTPUTPATH);
        }
    });
}

module.exports = {
    parse: function() {


        var workbook = XLSX.readFile(INPUTPATH);

        var collection = workbook['Sheets'];

        var courses = new HashMap();
        var counter = 1;

        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                var isCourseSheet = /^20\d\d_20\d\d$/;
                if(isCourseSheet.test(key)){
                    sheet = collection[key];

                    //range: [first column, last column]
                    var range = sheet['!ref'].split(':');
                    var numberOfRows = range[1].substr(1);

                    for (i = 1; i < numberOfRows+1; i++) {
                        if (sheet.hasOwnProperty('F' + i)){
                            isExam = sheet['F' + i]['v'].toLowerCase() == 'tentamen';

                            if(isExam) {
                                var course = {};

                                course.code  = sheet['A' + i]['v'].toUpperCase();
                                course.name  = sheet['B' + i]['v'].toLowerCase();
                                course.owner = sheet['D' + i]['v'].toLowerCase();

                                var grade = gradeToKey(sheet['I' + i]['v']);
                                if (grade != 'undefined'){
                                    exam = {}
                                    exam['date'] = sheet['H' + i]['v'];
                                    exam[grade] = sheet['J' + i]['v'];

                                    if(courses.has(course.code)){
                                        var course = courses.get(course.code);

                                        if(course.exams[course.exams.length - 1]['date'] == exam['date']){
                                            //if exam exists, extend grade.
                                            course.exams[course.exams.length - 1][grade] = exam[grade];
                                        }
                                        else{
                                            //create a new exam
                                            course.exams.push(exam);
                                        }
                                        courses.set(course.code, course);
                                    }
                                    else {
                                        //create a new course
                                        course['exams'] = [exam];
                                        courses.set(course.code, course);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            console.log(Math.floor(counter * (100/Object.keys(collection).length)) + '%');
            counter++;
        }
        SaveToFile(courses);
    }
};