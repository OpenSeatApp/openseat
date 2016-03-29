angular.module('dashboardModule', [])

.controller('renderUserCtrl', function($scope, RenderUser, $rootScope, Routes, PostRoute) {

	var geocoder = initMap();
	var shownElement = 'all';
	$(document).ready(function() {
		$('#toTime').timepicker({ 'scrollDefault': 'now' });
		$('#fromTime').timepicker({'scrollDefault' : 'now'});
		$('#toTime').timepicker('setTime', new Date());
		$('#fromTime').timepicker('setTime', new Date());
		$('body').click(function() {
			if ($('.driverToggle').hasClass('selected')) {
				$(".isDriver").show();
			} else {
				$(".isDriver").hide();
			}
		});

		$('#navTools').on('click', 'p', function(){
			var element = $(this).attr('data-forElement');
			console.log('here', element, shownElement)
			if(element !== shownElement){
        if(element === 'routeForm'){
          $('.allRoutes').hide();
        } else {
          $('.allRoutes').show();
        }
				if(element === 'all'){
					$('.routeForm').hide();
          $('.notConfirmed').show();
          $('.confirmed').show();
				} else {
					if(shownElement === 'all'){
						$('.notConfirmed').hide();
						$('.confirmed').hide();
          } 
				  $('.' + element).show();
          $('.' + shownElement).hide();
				}
				shownElement = element;
			}
		});

		$('.driverToggle').on('click', function(){
			var $this = $(this)
			if($this.hasClass('selected')){
				$this.removeClass('selected');
			} else {
				$(this).addClass('selected');
			}
			
		});
		$('.dayToggle').on('click', function(){
			var $this = $(this);
			if($this.hasClass('selected')){
				$this.removeClass('selected');
			} else {
				$(this).addClass('selected');
			}
			
		});
	});

	// This function takes an array of routes and iterates over it replacing the array of booleans
	// that represend the days and returns a string with the requested days.

	var setDays = function(arrayOfRoutes, isDriver) {
		var days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
		for (var i = 0; i < arrayOfRoutes.length; i++) {
			if (isDriver) {
				setDays(arrayOfRoutes[i].confirmedPassengerRoutes);
				setDays(arrayOfRoutes[i].prospectivePassengerRoutes);
			}
			if (arrayOfRoutes[0]) {
				arrayOfRoutes[i].days = arrayOfRoutes[i].days.reduce(function(memo, day, index) {
					if (day) {
						memo = memo.concat(days[index]);
					}
					return memo;
				}, []);
			}
		}
		return arrayOfRoutes;
	};

	var initializePassengerRoutes = function(passengerId) {
		Routes.getPassengerRoutesForUserId(passengerId, function(passengerRoutes) {
			$scope.passengerRoutes = setDays(passengerRoutes);
		});
	};

	var initializeDriverRoutes = function(driverId) {
		Routes.getDriverRoutesForUserId(driverId, function(driverRoutes) {
			$scope.driverRoutes = setDays(driverRoutes, true);
		});
	};

	$scope.deleteConfirmedPassenger = function(passengerRouteId) {};

	$scope.confirmPassenger = function(passengerRouteId, driverRouteId) {
		var currArr = this.$parent.route.prospectivePassengerRoutes;
		for(var i = 0; i < currArr.length; i++){
			if (currArr[i]._id === passengerRouteId) {
				var addedRoute = this.$parent.route.prospectivePassengerRoutes.splice(i, 1);
				this.$parent.route.confirmedPassengerRoutes.push(addedRoute);
		}

		}
		Routes.driverConfirmsPassenger(driverRouteId, passengerRouteId, function() {
			initializeDriverRoutes($rootScope.user._id);
		});
	};


	$scope.username = 'Hello, ' + $rootScope.user.name;
	if ($rootScope.user.IsDriver) {
		initializeDriverRoutes($rootScope.user._id);
	} else {
		initializePassengerRoutes($rootScope.user._id);
	}


	
	$scope.submitRoute = function() {
		var monday = $('#monday').hasClass('selected');
		var tuesday = $('#tuesday').hasClass('selected');
		var wednesday = $('#wednesday').hasClass('selected');
		var thursday = $('#thursday').hasClass('selected');
		var friday = $('#friday').hasClass('selected');
		var saturday = $('#saturday').hasClass('selected');
		var sunday = $('#sunday').hasClass('selected');
		var fromTime = $('#fromTime').val().split(':');
		fromTime[2] = fromTime[1].slice(2);
		fromTime[1] = Number(fromTime[1].slice(0,2));
    fromTime[0] = Number(fromTime[0]);
    if(fromTime[2][0] === 'p'){
      fromTime[0] += 12;
    }
		var toTime = $('#toTime').val().split(':');
    toTime[2] = toTime[1].slice(2);
    toTime[1] = Number(toTime[1].slice(0,2));
    toTime[0] = Number(toTime[0]);
    if(toTime[2][0] === 'p'){
      toTime[0] += 12;
    }
		var routeObj = {};
		routeObj.days = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
		routeObj.fromHour = fromTime[0];
		routeObj.fromMinutes = fromTime[1];
		routeObj.toHour = toTime[0];
		routeObj.toMinutes = toTime[1];
		routeObj.seats = Number($('#seats').val());
		routeObj.fee = Number($('#fee').val());
		routeObj.name = $rootScope.user.name;

		var newRoute = PostRoute.newRoute;
		var data = {};
    var addresses = []
    addresses.push($('#startAddress').val());
    addresses.push($('#endAddress').val());
		data.route = routeObj;
		data.userId = $rootScope.user._id;
		data.isDriver = $('#isDriver').prop('checked');

		geocodeAddressStart(geocoder, data, newRoute, addresses, function(geocoder, data, start, addresses, newRoute) {
			geocodeAddressEnd(geocoder, data, start, addresses, newRoute);
		});
	};
});