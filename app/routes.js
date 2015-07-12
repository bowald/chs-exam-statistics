// var Course = require('./model/course');

  module.exports = function(app) {

    // server routes ===========================================================

    app.get('*', function(req, res){
      res.sendfile('./dist/index.html');
    });

  };