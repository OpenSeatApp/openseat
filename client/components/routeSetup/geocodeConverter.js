function initMap() {

	var geocoder = new google.maps.Geocoder();
	return geocoder;
}

function geocodeAddressStart(geocoder, data, newRoute, callback) {
	var address = startAddress.value;
	var start = [];
	data.route.startLabel = address;
	geocoder.geocode({
		'address': address
	}, function(results, status) {
		start[0] = results[0].geometry.location.lat();
		start[1] = results[0].geometry.location.lng();
		callback(geocoder, data, start, newRoute);
	});
}

function geocodeAddressEnd(geocoder, data, start, newRoute) {
	var address = endAddress.value;
	var end = [];
	data.route.endLabel = address;
	geocoder.geocode({
		'address': address
	}, function(results, status) {
		end[0] = results[0].geometry.location.lat();
		end[1] = results[0].geometry.location.lng();
		data.route.start = start;
		data.route.end = end;
		newRoute(data);

	});
}