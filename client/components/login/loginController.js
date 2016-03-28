angular.module('loginModule', [])
  .controller('loginController', function($rootScope, $scope){
    setInterval(function(){
      if($rootScope.user){
        $scope.status = 'logout';
      } else {
        $scope.status = 'login';
      }
    }, 500);
  });