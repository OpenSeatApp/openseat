angular.module('selectDriverModule', ['ngMap'])
  .controller('selectDriverCtrl', function($scope, $rootScope, $routeParams, Routes, ngMap){
    var passengerRouteId = $routeParams.id;
    $scope.driverRoutes = {};
    $scope.googleMapsURL = "https://maps.googleapis.com/maps/api/js?key=KEY_GOES_HERE";

    NgMap.getMap().then(function (map) {
      var initializeDriverRoutes = function(passengerRouteId){
        Routes.bestDriverRoutesForPassengerRouteId(passengerRouteId, function(driverRoutes){
          $scope.driverRoutes = driverRoutes;
      });
    };

    //my guess is that I want the function on initialize to create the elements, bind them to scope

      if (passengerRouteId) {
      initializeDriverRoutes(passengerRouteId);
      }

      $scope.selectDriverRoute = function(driverRouteId){
        Routes.userInterestedInDriverRoute(passengerRouteId, driverRouteId);
      //TODO show something in the view that confirms the driverRoute was added
      };
    });


  });