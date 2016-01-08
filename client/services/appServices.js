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

	.factory('RenderRoute', function($window, $q) {

		//the reason we need asynchronicity here is bcs the source has to 
			//exist and be loaded before we try to do anything with the map
		//but we have to specify a callback in the URL to google
		//so for the timing to work out…

		var url = "https://maps.googleapis.com/maps/api/js?key=KEY_GOES_HERE&callback=mapInit";
		var script = document.createElement('script');
		script.src = url;
		var asyncLoad = function() {
			console.log('asyncLoad fired');
			document.body.appendChild(script);
			myDefer.resolve();
		};

		var myDefer = $q.defer();
		//get an MVP first
			//a chance to move markers can come later

		// routeMethods.renderMap = function(id, center, zoom, $scope) {
		// 	console.log($window);
		// 	var map = new $window.google.maps.Map(document.getElementById(id), {
		// 		center: center,
		// 		zoom: zoom
		// 	});

		$window.dummyCallback = function() {
			console.log('dummy fired');
			myDefer.resolve();
		};

		asyncLoad(dummyCallback);

			// $window.renderMap = function(id, center, zoom, $scope) {
			// 	console.log(this);
			// 	document.body.appendChild(script);
			// 	var map = new this.google.maps.Map(document.getElementById(id), {
			// 		center: center,
			// 		zoom: zoom
			// 	});

			// 	this.google.maps.event.addListener(map, 'click', function(event) {
			// 		addMarker(event.latLng, map);
			// 	});

			$window.mapInit = function() {
				console.log('mapInit mentioned');
				//i'll try to make id, center, zoom variables if I can later
				var map = new $window.google.maps.Map(document.getElementById('map'), {
					center: {lat: 37.784, lng: -122.409},
					zoom: 14
				});
			};

				return {mapIsThere: myDefer.promise,
					mapInit: $window.mapInit};
			});

			//contains key. DOES NOT GO TO GITHUB
			
		
		// $window.google.maps.event.addListener(map, 'click', function(event) {
		// 	addMarker(event.latLng, map);
		// 	//sth to extract the coordinates
		// 	//possibly remove the previous label
		// });

	// 	var addMarker = function(location, map) {
	// 		var marker = new google.maps.Marker({
	// 			position: location,
	// 			label: 'A',
	// 			map: map
	// 		});
		// });

// 	// 	return routeMethods;

// });
