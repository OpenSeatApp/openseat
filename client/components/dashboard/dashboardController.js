angular.module('dashboardModule', [])

.controller('renderUserCtrl', function($scope, RenderUser, $rootScope, Routes){
	$scope.passengerRoutes = {};
	$scope.driverRoutes = {};

	var initializePassengerRoutes = function(passengerId){
		Routes.getPassengerRoutesForUserId(passengerId, function(passengerRoutes){
			$scope.passengerRoutes = passengerRoutes;
		});
	};

	var initializeDriverRoutes = function(driverId){
		Routes.getDriverRoutesForUserId(driverId, function(driverRoutes){
			$scope.driverRoutes = driverRoutes;
		});
	};
	
	$scope.username = 'Hello ' + $rootScope.user.name;
	if ($rootScope.user.isDriver){
		initializeDriverRoutes($rootScope.user._id);
	} else {
		initializePassengerRoutes($rootScope.user._id);
	}
});