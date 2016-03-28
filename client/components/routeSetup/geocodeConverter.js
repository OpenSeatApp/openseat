function initMap() {

	var geocoder = new google.maps.Geocoder();
	return geocoder;
}

function geocodeAddressStart(geocoder, data, newRoute, addresses, callback) {
	var address = addresses[0];
	var start = [];
	data.route.startLabel = address;
	geocoder.geocode({
		'address': address
	}, function(results, status) {
		console.log(results)
		start[0] = results[0].geometry.location.lat();
		start[1] = results[0].geometry.location.lng();
		callback(geocoder, data, start, addresses, newRoute);
	});
}

function geocodeAddressEnd(geocoder, data, start, addresses, newRoute) {
	var address = addresses[1];
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