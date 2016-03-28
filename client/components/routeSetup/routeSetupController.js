angular.module('routeSetupModule', [])
	.controller('routeSetupCtrl', function(PostRoute, $scope, $rootScope) {
		var geocoder = initMap();
		$(document).ready(function() {
			$('#toTime').timepicker({ 'scrollDefault': 'now' });
			$('#fromTime').timepicker({'scrollDefault' : 'now'});
			$('#toTime').timepicker('setTime', new Date())
			$('#fromTime').timepicker('setTime', new Date())
			$('body').click(function() {
				if ($('.driverToggle').hasClass('selected')) {
					$(".isDriver").show();
				} else {
					$(".isDriver").hide();
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
				var $this = $(this)
				if($this.hasClass('selected')){
					$this.removeClass('selected');
				} else {
					$(this).addClass('selected');
				}
				
			});
		});
	
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
			fromTime[1] = fromTime[1].slice(0,2);
			var toTime = $('#toTime').val();
			console.log(fromTime)

			var routeObj = {};
			routeObj.days = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
			routeObj.fromHour = fromTime;
			routeObj.fromMinutes = Number($('#fromMinutes').val());
			routeObj.toHour = Number($('#toHour').val());
			routeObj.toMinutes = Number($('#toMinutes').val());
			routeObj.seats = Number($('#seats').val());
			routeObj.fee = Number($('#fee').val());
			routeObj.name = $rootScope.user.name;

			var newRoute = PostRoute.newRoute;
			var data = {};
			data.route = routeObj;
			data.userId = $rootScope.user._id;
			data.isDriver = $('#isDriver').prop('checked');

			geocodeAddressStart(geocoder, data, newRoute, function(geocoder, data, start, newRoute) {
				geocodeAddressEnd(geocoder, data, start, newRoute);
			});
		};
	});