var dbURI      = 'mongodb://localhost/demo-app-clearing-db',
    mongoose   = require('mongoose'),
    Model      = require('../app/model'),
    Exam       = Model.exam,
    Course     = Model.course,
    clearDB    = require('mocha-mongoose')(dbURI),
    should     = require( 'chai' ).should;


var Course1 = {
                code: 'TDA341',
                name: 'Advanced functional programming',
                owner: 'DATAVETENSKAP - ALGORITMER, PROGRAMSPRÅK OCH LOGIK, MASTERPROGRAM'
                };


describe('Testing Course', function() {
    beforeEach(function(done) {
        if (mongoose.connection.db){
            return done();
        }
        mongoose.connect(dbURI, done);
    });

    it('can be saved withour exams', function(done) {
         new Course(Course1).save(done);
    });
});