angular.module('routeSetupModule', [])

  .controller('routeSetupCtrl', function($scope, $window, RenderRoute){
    //centered at HackReactor, zoom seems convenient.
    console.log('controller fired');
    RenderRoute.mapIsThere
    .then(function() {
      console.log('mapInit about to fire');
      console.log('some successor function fired');
    })
    .then($window.mapInit);
  });