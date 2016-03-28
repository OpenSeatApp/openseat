angular.module('openSeatApp', ['ngRoute', 'loginModule','openSeat.services', 'dashboardModule','routeSetupModule', 'selectDriverModule', 'ngMap'])
  .config(['$routeProvider',
    function($routeProvider) {
      var checkLoggedin = function($q, $http, $location, $rootScope) {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user) {
          if (user !== '0') {
            $rootScope.user = user;
            deferred.resolve();
          } else {
            deferred.reject();
            $location.url('/login');
          }
        });


        return deferred.promise;
      };

      $routeProvider.
      when('/home', {
        templateUrl: './components/dashboard/dashboardView.html',
        controller: 'renderUserCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      }).
      when('/createRoute', {
        templateUrl: './components/routeSetup/routeSetupView.html',
        controller: 'routeSetupCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      }).
      when('/selectDriver/:id', {
        templateUrl: './components/selectDriver/selectDriverView.html',
        controller: 'selectDriverCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      }).
      when('/login', {
        templateUrl: './components/login/loginView.html'
      }).
      otherwise({
        redirectTo: '/home'
      });
    }
  ])
  .controller('appController', function($rootScope, $scope){
    if($rootScope.status === 'login'){
      $scope.path = 'api/logout';
      $scope.status = 'logout';
    } else {
      $scope.path = '/api/auth/facebook';
      $scope.status = 'login';
    }

    $scope.loginOrOut = function(){
      if($rootScope.status === 'logout'){
        $rootScope.status = 'login';
      } else {
        $rootScope.status = 'logout';
      }
    };
  });












