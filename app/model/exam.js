var mongoose = require('mongoose');
var Schema    = mongoose.Schema;

var examSchema = new Schema({
    date: {type: Date, require:true},
    results: {
            type: {
                three: {type: Number, default: 0},
                four: {type: Number, default: 0},
                five: {type: Number, default: 0},
                notPassed: {type: Number, default: 0}
            },
            required: true
        }
});

module.exports = mongoose.model('Exam', examSchema);