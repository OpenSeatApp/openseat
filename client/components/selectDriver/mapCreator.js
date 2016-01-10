var createMap = function(elem, center, zoom) {
  //elem is the DOM element where the map is attached
    //a variable bcs we will invoke this function multiple times with different maps
  //center is the center of the map
  //zoom is the zoom -> I like 14, but this should be variable
    firstMap = new google.maps.Map(document.getElementById(elem), {
    center: {lat: 37.784, lng: -122.409},
    zoom: 14
    });
};