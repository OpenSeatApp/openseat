angular.module('selectDriverModule', [])
  .controller('selectDriverCtrl', function($scope, $rootScope, $routeParams, Routes){
    var passengerRouteId = $routeParams.id;
    $scope.driverRoutes = {};

    var initializeDriverRoutes = function(passengerRouteId){
      Routes.bestDriverRoutesForPassengerRouteId(passengerRouteId, function(driverRoutes){
        $scope.driverRoutes = driverRoutes;
        //I expect driverRoutes to be an array, and I iterate over that array
        for (var i = 0; i < driverRoutes.length; i++) {
          //I *may* need to coerce the id to string
          //for now, I'm hard-coding the center and zoom (also in the page where I have acccess)
            //TODO: make them variable
          createMap(driverRoutes[i].driverRoute._id, {lat: 37.784, lng: -122.409}, 14);

          //I also need the css styling for this page to work a certain way.
        }
      });
    };

    //my guess is that I want the function on initialize to create the elements, bind them to scope

    if (passengerRouteId) {
      initializeDriverRoutes(passengerRouteId);
    }

    $scope.selectDriverRoute = function(driverRouteId){
      Routes.userInterestedInDriverRoute(passengerRouteId, driverRouteId);
      //TODO show something in the view that confirms the driverRoute was added

      //I need DOM elements so that I can create the maps
      //but I have to invoke the function multiple times
      //ok. How about this: as we create the DOM, we will attach an id to appropriate elements of each driver
      //then we loop over those elements, and create maps for each one
    };
  });