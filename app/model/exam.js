var mongoose = require('mongoose');
var Schema    = mongoose.Schema;

// use CreateIndex true before mongoose.model to get rid of DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// More info https://github.com/Automattic/mongoose/issues/6890#issuecomment-417050608
mongoose.set('useCreateIndex', true);

var examSchema = new Schema({
    date: {type: Date, require:true},
    three: {type: Number, default: 0},
    four: {type: Number, default: 0},
    five: {type: Number, default: 0},
    notPassed: {type: Number, default: 0}
},{ _id : false });

module.exports = mongoose.model('Exam', examSchema);