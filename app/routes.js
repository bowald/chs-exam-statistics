var Course = require('./models/course');

  module.exports = function(app) {

    // server routes ===========================================================

    app.get('/api/course', function(req, res){
      Course.find(function(err, courses){

        if(err){
          res.send(err);
        }

        //return all courses
        res.json(courses);
      });
    });

    app.post('/api/course', function(req, res){

      Course.create({
         code: req.body.code,
         name: req.body.name,
         credit: req.body.credit
      }, function(err, course){
          if(err){
            res.send(err);
          }
      });

    });

    app.get('*', function(req, res){
      res.sendfile('./dist/index.html');
    });

  };