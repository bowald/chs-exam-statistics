var mongoose = require('mongoose');
var Schema    = mongoose.Schema;

var examSchema = new Schema({
    date: {type: Date, require:true},
    three: {type: Number, default: 0},
    four: {type: Number, default: 0},
    five: {type: Number, default: 0},
    notPassed: {type: Number, default: 0}
},{ _id : false });

module.exports = mongoose.model('Exam', examSchema);