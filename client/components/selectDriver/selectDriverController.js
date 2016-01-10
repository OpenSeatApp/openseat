angular.module('selectDriverModule', [])
  .controller('selectDriverCtrl', function($scope, $rootScope, $routeParams, Routes){
    var passengerRouteId = $routeParams.id;
    $scope.driverRoutes = {};

    var initializeDriverRoutes = function(passengerRouteId){
      Routes.bestDriverRoutesForPassengerRouteId(passengerRouteId, function(driverRoutes){
        console.log(driverRoutes, 'these are the driver routes');
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