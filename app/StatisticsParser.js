const XLSX = require('xlsx');
const fs = require('fs');
const https = require('https');
const path = require('path')
const moment = require('moment');
const Course  = require('./model/course');

function _gradeToKey(grade) {
    if (grade === '3') return 'three';
    else if (grade === '4') return 'four';
    else if (grade === '5') return 'five';
    else if (grade === 'u') return 'notPassed';
    else return '';
};

function _toDate(s, print) {
    if(!s) return false
    const m = moment(s);
    if (!m.isValid()){
        return false
    }
    return m.toDate()
}

function _getString(sheet, column, row) {
    const key = `${column}${row}`
    if (key in sheet) {
        return sheet[key].w.toLowerCase()
    }
    return ''
}

function _parseRow(sheet, row) {
    const date = _toDate(_getString(sheet, 'H', row))
    if (!date) return false;
    return {
        code: _getString(sheet, 'A', row).toUpperCase(),
        name: _getString(sheet, 'B', row),
        grade: _gradeToKey(_getString(sheet, 'I', row)),
        owner: _getString(sheet, 'D', row),
        date: date,
        nrOfStudents: _getString(sheet, 'J', row),
        type: _getString(sheet, 'F', row)
    }
}

class StatisticsParser {
    constructor () {
        this.filename = process.env.FILENAME || 'statistik.xlsx';
        this.url = process.env.STATISTICS_URL || 'https://document.chalmers.se/download?docid=00000000-0000-0000-0000-00001C968DC6';
        this.courses = {}
    }

    SaveToFile(filename) {
        fs.writeFile(filename, JSON.stringify(this.courses, null, 4), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + filename);
            }
        });
    }

    SaveToDb() {
      Object.values(this.courses).forEach(course => {
        Course.update(
            {code: course.code}, 
            {
                name: course.name,
                code: course.code,
                owner: course.owner,
                $addToSet: {exams: {$each: course.exams}}
            },
            {upsert: true}, 
            err => {
                if (err) {
                    console.log(err)
                }
            });
      });
    }

    getStatistics() {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(path.join(__dirname, this.filename));
            const request = https.get(this.url, function (res) {
                const stream = res.pipe(file);
                stream.on('finish', () => {
                    resolve();
                });
                stream.on('error', err => {
                    reject(err);
                })
            });
        });
    }

    getCourse(rowData) {
        if (!(rowData.code in this.courses)) {
            this.courses[rowData.code] = {
                code: rowData.code,
                name: rowData.name,
                owner: rowData.owner,
                exams: []
            };
        }
        return this.courses[rowData.code]
    }

    parse() {
        const workbook = XLSX.readFile(path.join(__dirname, this.filename));
        const collection = workbook['Sheets'];

        Object.entries(collection).forEach(([name, sheet]) => {
            const isCourseSheet = /20\d\d_20\d\d$/;
            // Itterate over sheets in excel doc
            if (isCourseSheet.test(name)) {
                //range: [first column, last column]
                const range = sheet['!ref'].split(':');
                const numberOfRows = range[1].substr(1);

                for (let row = 1; row < numberOfRows + 1; row++) {
                    const rowData = _parseRow(sheet, row)
                    if (!rowData) continue;
                    // Check if row contains results from an exam (skips projects etc)
                    if (rowData.type === 'tentamen') {
                        const course = this.getCourse(rowData)

                        let examIndex = course.exams.findIndex(e => { return e.date.getTime() === rowData.date.getTime() })
                        if (examIndex < 0) {
                            examIndex = course.exams.length
                            course.exams.push({ date: rowData.date });
                        }
                        course.exams[examIndex][rowData.grade] = rowData.nrOfStudents;
                    }
                }
            }
        });
    }
};

module.exports = StatisticsParser