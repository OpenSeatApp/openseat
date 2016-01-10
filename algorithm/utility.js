var spherical = require('spherical');

//assume I have access to the google maps API
//assume I have whatever inputs I need
//assume 4 arrays, all 2ples
  //[start, end] for distances
  //[start, end] for time windows
module.exports = function(firstRoute, secondRoute, firstTime, secondTime, firstDays, secondDays) {
  //note that the spherical.distance expects [lon1, lat1] and [lon2, lat2]

  //7 days in a week; firstDays and secondDays are arrays of Booleans representing days
  for (var i = 0; i < 7; i++) {
    if (firstDays[i] && firstDays[i] !== secondDays[i]) {
      return false;
    }
  }

  var toMinutes = function(arr) {
    //takes a 2ple, [hrs, mins]
    return 60*arr[0] + arr[1];
  };

  var firstInMinutes = [toMinutes(firstTime[0]), toMinutes(firstTime[1])];
  var secondInMinutes = [toMinutes(secondTime[0]), toMinutes(secondTime[1])];
  var sourceDist = spherical.distance(firstRoute[0], secondRoute[0]);
  var destDist = spherical.distance(firstRoute[1], secondRoute[1]);
  var beginDist = Math.max(firstInMinutes[0] - secondInMinutes[0], secondInMinutes[0] - firstInMinutes[0]);
  var endDist = Math.max(firstInMinutes[1] - secondInMinutes[1], secondInMinutes[1] - firstInMinutes[1]);

  //this is effectively an equivalence between distance and time.
  //1 min outside time window is worth scalar meters outside space window
  //5.0 km/hour (wikipedia), so 5000 m/hr, so 5000 / 60 or about 83 m / min.
  var scalar = 83;

  var totalDist = sourceDist + destDist + scalar * (beginDist + endDist);

  return totalDist;

  //we want the end matches
    //if we want to return a Boolean
      //we can compare totalDist to some totalTooFar factor
      //and have 2 or 4 partialTooFar factors for outside the window
    //but totalDist works fine to get just the 5 best routes
};