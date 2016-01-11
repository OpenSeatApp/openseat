angular.module('openSeat.services', [])
	.factory('RenderUser', function($http) {

		var userMethods = {};

		// $scope can only be used in controllers, not in services or factories
		// in order to use the $scope object, it needs to be passed as an argument
		// when the method gets invoked in the controller.

		userMethods.getUser = function(driverCallback, passengerCallback, $scope) {
			$http.get('/api/users/:userId') //TODO finish the path to specific user
				.then(function(user) {
					if (user.IsDriver) {
						driverCallback(user, $scope);
					} else {
						passengerCallback(user, $scope);
					}
				});
		};
		userMethods.renderDriver = function(user, $scope) {
			user = {
				name: 'John Doe',
				DriverRoutes: [{
					name: 'someRoute'
				}, {
					name: 'anotherRoute'
				}]
			};
			$scope.username = user.name;
			$scope.picture = user.picture;
			$scope.routes = user.DriverRoutes;
		};
		userMethods.renderPassenger = function(user, $scope) {
			user = {
				PassengerRoutes: [{
					start: 'San Mateo',
					end: 'San Francisco',
					days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
					fromHour: 7,
					fromMinutes: 30,
					toHour: 8,
					toMinutes: 30,
					confirmedDriverRoute: false,
					confirmedDriver: {
						name: null,
						phoneNumber: null,
						photo: null
					}
				}, {
					start: 'San Francisco',
					end: 'San Mateo',
					days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
					fromHour: 18,
					fromMinutes: 30,
					toHour: 19,
					toMinutes: 30,
					confirmedDriverRoute: true,
					confirmedDriver: {
						name: 'Neil Degrass-Tyson',
						phoneNumber: '408-355-3333',
						photo: './assets/photos/driver.jpg'
					}
				}]
			};
			// This formats the user information in a more presentable way,
			// It either adds a message telling the user that their route hasn't
			// been accepted by any drivers. Additionally, it joins the array of
			// days into a string that can be rendered on the screen.
			user.PassengerRoutes = user.PassengerRoutes.map(function(route) {
				route.itinerary = {};
				route.itinerary.from = 'From: ' + route.start;
				route.itinerary.to = 'To: ' + route.end;
				route.days = 'Days confirmed: ' + route.days.join(' ');
				if (!route.confirmedDriverRoute) {
					route.message = 'No driver has been confirmed';
				}
				return route;
			});

			$scope.picture = user.picture;
			$scope.routes = user.PassengerRoutes;
		};

		return userMethods;
	})
	.factory('PostRoute', function($http, $location) {
		var postRoute = {};

		postRoute.newRoute = function(route) {
			if (route.isDriver) {
				$http.post('/api/driverRoute', route)
					.then(function(result) {
						$location.path('/home');
					});
			} else {
				$http.post('/api/passengerRoute', route)
					.then(function(result) {
						var url = '/selectDriver/' + result.data._id;
						$location.path(url);
					});
			}
		};
		return postRoute;
	})
	.factory('Routes', function($http) {

		var bestDriverRoutesForPassengerRouteId = function(passengerRouteId, callback) {
			$http.get('/api/bestDriverRoutesForPassengerRouteId/' + passengerRouteId)
				.then(function(driverRoutes) {
					callback(driverRoutes.data);
				});
		};

		var userInterestedInDriverRoute = function(passengerRouteId, driverRouteId, callback) {
			return $http({
				method: 'POST',
				url: '/api/userInterestedInDriverRoute/',
				data: {
					passengerRouteId: passengerRouteId,
					driverRouteId: driverRouteId
				}
			})
			.then(function() {
				callback();
			});
		};

		var driverConfirmsPassenger = function(driverRouteId, passengerRouteId, callback){
			return $http({
				method: 'POST',
				url: '/api/driverConfirmsPassenger/',
				data: {
					passengerRouteId: passengerRouteId,
					driverRouteId: driverRouteId
				}
			})
			.then(function() {
				callback();
			});
		};

		var getPassengerRoutesForUserId = function(passengerId, callback){
			$http.get('/api/passengerRoute/' + passengerId)
				.then(function(passengerRoutes) {
					callback(passengerRoutes.data);
				});
		};

		var getDriverRoutesForUserId = function(driverId, callback){
			$http.get('/api/driverRoute/' + driverId)
				.then(function(driverRoutes) {
					callback(driverRoutes.data);
				});
		};

		return {
			bestDriverRoutesForPassengerRouteId: bestDriverRoutesForPassengerRouteId,
			userInterestedInDriverRoute: userInterestedInDriverRoute,
			getPassengerRoutesForUserId: getPassengerRoutesForUserId,
			getDriverRoutesForUserId: getDriverRoutesForUserId,
			driverConfirmsPassenger: driverConfirmsPassenger
		};
	});