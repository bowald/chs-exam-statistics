var mongoose = require('mongoose');
var Schema    = mongoose.Schema;
// define our nerd model
// module.exports allows us to pass this to other files when it is called

var course = new Schema({
  code: String,
  name: String,
  credit: Number,
});

module.exports.Course = mongoose.model('Course', course);