module.exports = {

    parse: function() {

        function gradeToKey(grade){
            if (grade == 3) return 'three';
            else if (grade == 4) return 'four';
            else if (grade == 5) return 'five';
            else if (grade == 'U') return 'notPassed';
            else return 'undefined';
        }

        if(typeof require !== 'undefined') {
            XLSX = require('xlsx');
        };

        var fs = require('fs');

        var workbook = XLSX.readFile(__dirname + '/Statistik_over_kursresultat-2.xlsx');
        /* DO SOMETHING WITH workbook HERE */
        var outputFilename = __dirname +'/courses.json';
        // console.log(workbook['Sheets']['2010_2011']['B2']['v']);

        var collection = workbook['Sheets'];
        var isCourseSheet = /^20\d\d_20\d\d$/;
        var courses = [];

        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                if(isCourseSheet.test(key)){
                    sheet = collection[key];
                    //range: [first column, last column]
                    var range = sheet['!ref'].split(':');
                    var numberOfRows = range[1].substr(1);

                    // console.log("rows: " + numberOfRows);
                    for (i = 1; i < numberOfRows+1; i++) {
                        if (sheet.hasOwnProperty('F' + i)){
                            isExam = sheet['F' + i]['v'].toLowerCase() == 'tentamen'

                            if(isExam) {
                                var course = {};
                                var exam = {};
                                course.code  = sheet['A' + i]['v'].toUpperCase();
                                course.name  = sheet['B' + i]['v'].toLowerCase();
                                course.owner = sheet['D' + i]['v'].toLowerCase();

                                exam.date = new Date(sheet['H' + i]['v']);
                                var grade = gradeToKey(sheet['I' + i]['v']);
                                if (grade != 'undefined'){
                                    exam.result = {}
                                    exam.result[grade] = sheet['J' + i]['v'];
                                    course.exam = exam;
                                }
                                    courses.push(course);
                            }
                        }
                    }
                }
            }
        }


        // console.log("Rows " + rows);
        fs.writeFile(outputFilename, JSON.stringify(courses, null, 4), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + outputFilename);
            }
        });
        return true;
    }
};