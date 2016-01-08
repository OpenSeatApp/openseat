

angular.module('openSeatApp', ['ngRoute', 'openSeat.services', 'dashboardModule','routeSetupModule', 'selectDriverModule'])

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
        // controller: 'routeSetupCtrl',
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
      when('/about', {
        templateUrl: './components/about/aboutView.html',
      }).
      when('/login', {
        templateUrl: './components/login/loginView.html',
      }).
      otherwise({
        redirectTo: '/home'
      });
    }
  ]);