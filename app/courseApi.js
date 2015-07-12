'use strict'
var mongoose    = require('mongoose'),
    express     = require('express'),
    courseRoute = express.Router();

var Course = mongoose.model('Course');


module.exports = {
    setup: function(app){

        courseRoute.get('/api/courses', function (req, res) {
            console.log(req.query.searchterm);
            Course.find({ name:  new RegExp(req.query.searchterm, "i")}, function (err, courses) {
                if(err){res.status(500).send(err);}
                res.json(courses);
            });


        });

        app.use(courseRoute);
    }
};