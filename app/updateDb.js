
var XLSX    = require('xlsx'),
    HashMap = require('hashmap'),
    fs      = require('fs'),
    http    = require('http'),
    ProgressBar = require('progress'),
    Course  = require('./model/course'),
    Q       = require('q');

var OUTPUTPATH = '/courses.json',
    FILENAME ='statistik.xlsx';

var gradeToKey = function (grade){
    if (grade == 3) return 'three';
    else if (grade == 4) return 'four';
    else if (grade == 5) return 'five';
    else if (grade == 'U') return 'notPassed';
    else return 'undefined';
};

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
    var bar = new ProgressBar('saving data [:bar] :percent ', {
                                        complete: '='
                                      , incomplete: ' '
                                      , width: 30
                                      , total: collection.length
                                    });

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
        bar.tick(1);
    });
}

module.exports = {

    getStatistics: function () {
        var deferred = Q.defer();

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
                console.log(file)
                deferred.resolve(FILENAME);
          })
        });

        req.on('error', function(err) {
            //if an error occurs reject the deferred
            console.log(err);
            deferred.reject(err);
        });
        req.end();

        return deferred.promise;
    },

    parse: function(filename) {
        console.log('starting to parse');
        console.log('resding from:');
        console.log(__dirname + '/' + filename);
        var workbook = XLSX.readFile(__dirname + '/' + filename);
        console.log('parse done');
        var collection = workbook['Sheets'];

        var courses = new HashMap();
        var bar = new ProgressBar('building json [:bar] :percent ', {
                                        complete: '='
                                      , incomplete: ' '
                                      , width: 30
                                      , total: Object.keys(collection).length
                                    });

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
            bar.tick(1);
        }
        SaveToDb(courses.values());
    }
};