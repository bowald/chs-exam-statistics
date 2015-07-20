'use strict';
var mongoose    = require('mongoose'),
    express     = require('express'),
    courseRoute = express.Router();

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