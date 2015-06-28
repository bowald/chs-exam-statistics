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

    // it('can be saved with a cameratype reference', function(done) {
    //     new CameraType(CameraTypeObj).save(function(err,model){
    //                     if (err) return done(err);

    //                     CameraType.findOne({'model': 'Oqus 7', 'lens' : 'canon 22mm'}, function(err,obj){
    //                         if (err) return done(err);

    //                         // obj.should.exist();
    //                         CameraObj.cameratype = obj._id;
    //                         new Camera(CameraObj).save(function(err,model){
    //                             if (err) return done(err);

    //                             Camera.find({}, function(err,doc){
    //                                 if (err) return done(err);
    //                                 doc.length.should.equal(1);

    //                                 doc[0].visible.should.equal(true);
    //                                 done();
    //                             });
    //                         });
    //                     });
    //                 });
    // });
});