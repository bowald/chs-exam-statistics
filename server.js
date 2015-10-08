var models = require('./app/model');

var express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose'),
    updateDb       = require('./app/updateDb.js');


var db = require('./config/db');

var port = process.env.PORT || 8080;


// connect to mongoDB database
mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/dist'));

// routes ==================================================

require('./app/courseApi').setup(app);
require('./app/routes')(app);


// start app ===============================================

// TO BE ABLE TO USE GULP COMMENT THIS!
downloadAndUpdate();
// When using gulp run downloadAndUpdate() once to store data in db, then comment it away.

// update db every 24 hours.
setInterval(downloadAndUpdate, 86400000);


function downloadAndUpdate() {
  updateDb.getStatistics().then(
    function (filename) {
        // Unable to parse without delay, even if waiting for promise. Fix?
        setTimeout(function (hello) {
            updateDb.parse(filename);
        },20);
    },
    function (err) {
        console.log(err);
    });
}



// expose app
exports = module.exports = app;