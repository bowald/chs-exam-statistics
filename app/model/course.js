var mongoose = require('mongoose');
var Schema    = mongoose.Schema;

// use CreateIndex true before mongoose.model to get rid of DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// More info https://github.com/Automattic/mongoose/issues/6890#issuecomment-417050608
mongoose.set('useCreateIndex', true);

var ExamSchema = mongoose.model('Exam').schema;

var courseSchema = new Schema({
    code: {type:String, required:true, unique:true},
    name: {type:String, required:true},
    owner: {type:String, required:true},
    exams: [ExamSchema]
});

module.exports = mongoose.model('Course', courseSchema);