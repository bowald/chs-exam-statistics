const models = require('./app/model');

const express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose'),
    updateDb       = require('./app/updateDb.js');


// connect to mongoDB database
const mongouri = process.env.MONGO_URI || "mongodb://localhost:27017/chs-exam-statistics";
// mongoose.connect(mongouri);

mongoose.connect(mongouri, { useNewUrlParser: true });

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


app.set('port', process.env.PORT || 3000);

// routes ==================================================

require('./app/courseApi').setup(app);
require('./app/routes')(app);


// start app ===============================================
// downloadAndUpdate();
updateDb.parse('statistik.xlsx');
// When using gulp run downloadAndUpdate() once to store data in db, then comment it away.

// update db every 24 hours.
setInterval(downloadAndUpdate, 86400000);

start();

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

function start() {
    app.listen(app.get('port'), function () {
        console.log('Express server listening on port ', app.get('port'));
    });
}

// expose app
exports = module.exports = app;