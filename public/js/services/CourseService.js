
angular.module('CourseService',[]).factory('Course', ['$http', function($http){

  return {
    get : function(){
      return $http.get('/api/course');
    },
    create : function(courseData){
      return $http.post('/api/course', courseData);
    },

    delete : function(id) {
      return $http.delete('/api/course' + id);
    }
  }

}]);