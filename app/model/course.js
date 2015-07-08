var mongoose = require('mongoose');
var Schema    = mongoose.Schema;
var ExamSchema = mongoose.model('Exam').schema;

var courseSchema = new Schema({
    code: {type:String, required:true, unique:true},
    name: {type:String, required:true},
    owner: {type:String, required:true},
    exams: [ExamSchema]
});

module.exports = mongoose.model('Course', courseSchema);