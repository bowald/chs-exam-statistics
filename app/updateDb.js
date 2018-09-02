
var XLSX    = require('xlsx'),
    fs      = require('fs'),
    http    = require('http'),
    moment = require('moment'),
    Course  = require('./model/course')

var OUTPUTPATH = '/courses.json',
    FILENAME ='statistik.xlsx';

var gradeToKey = function (grade){
    if (grade === '3') return 'three';
    else if (grade === '4') return 'four';
    else if (grade === '5') return 'five';
    else if (grade === 'U') return 'notPassed';
    else return 'undefined';
};

var toDate = s => {
    return moment(s).toDate()
}

//usefull for debugging pourpuses.
var SaveToFile = function(collection){
    fs.writeFile(OUTPUTPATH, JSON.stringify(collection, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + OUTPUTPATH);
        }
    });
};

var SaveToDb = function (collection) {
    collection.forEach(function (course) {
        Course.update({code: course.code},{
            name: course.name,
            code: course.code,
            owner: course.owner,
            $addToSet: {exams:{$each : course.exams}}
        },
        {upsert:true},
        function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

module.exports = {

    getStatistics: function () {
        return new Promise((resolve, reject) => {

        var options = {
            hostname  : 'document.chalmers.se',
            port      : 80,
            path      : '/download?docid=479628742',
            method    : 'GET'
        };

        var file = fs.createWriteStream(__dirname + '/' + FILENAME);
        var req = http.request(options, function(res) {
          res.on('data', function(chunk) {
              file.write(chunk);
          });

          res.on('end', function () {
                resolve(FILENAME);
          })
        });

        req.on('error', function(err) {
            //if an error occurs reject the deferred
            console.log(err);
            reject(err);
        });
        req.end();

        });
    },

    parse: function(filename) {
        var workbook = XLSX.readFile(__dirname + '/' + filename);
        var collection = workbook['Sheets'];
        const courses = {};

        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                var isCourseSheet = /20\d\d_20\d\d$/;
                // Itterate over sheets in excel doc
                if(isCourseSheet.test(key)){
                    sheet = collection[key];
                    //range: [first column, last column]
                    var range = sheet['!ref'].split(':');
                    var numberOfRows = range[1].substr(1);

                    // Itterate over rows in sheet
                    for (i = 1; i < numberOfRows+1; i++) {
                        if (sheet.hasOwnProperty('F' + i)){
                            isExam = sheet['F' + i].w.toLowerCase() === 'tentamen';
                            const code = sheet['A' + i].w.toUpperCase();
                            if(isExam) {
                                var grade = gradeToKey(sheet['I' + i].w);
                                if (grade != 'undefined'){
                                    const exam = {}
                                    exam['date'] = toDate(sheet['H' + i].w);
                                    exam[grade] = sheet['J' + i].w;

                                    if (code in courses){
                                        const course = courses[code];

                                        if(course.exams[course.exams.length - 1]['date'] == exam['date']){
                                            //if exam exists, extend grade.
                                            course.exams[course.exams.length - 1][grade] = exam[grade];
                                        }
                                        else{
                                            //create a new exam
                                            course.exams.push(exam);
                                        }
                                        courses[code] = course
                                    }
                                    else {
                                        //create a new course
                                        const course = {
                                            code: code,
                                            name: sheet['B' + i].w.toLowerCase(),
                                            owner: sheet['D' + i].w.toLowerCase(),
                                            exams: [exam]
                                        };
                                        courses[code] = course
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        SaveToDb(Object.values(courses));
    }
};