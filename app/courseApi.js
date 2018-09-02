'use strict';
var mongoose    = require('mongoose'),
    express     = require('express'),
    courseRoute = express.Router();

// use CreateIndex true before mongoose.model to get rid of DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// More info https://github.com/Automattic/mongoose/issues/6890#issuecomment-417050608
mongoose.set('useCreateIndex', true);

var Course = mongoose.model('Course');

module.exports = {
    setup: function(app){

        courseRoute.get('/api/courses', function (req, res) {
            var term = new RegExp(req.query.searchterm, 'i');
            Course.find({ $or: [{name:  term}, {code: term}, {owner: term} ]}, function (err, courses) {
                if(err){res.status(500).send(err);}
                else{
                    res.json(courses);
                }
            });


        });

        app.use(courseRoute);
    }
};