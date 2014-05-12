var mapApp = angular.module("Map", ['ui.bootstrap'])

mapApp.service('GeocodingService', function($q, $http, $window) {
  return {

    getGPSCoordinates: function(country, city) {
      var deferred = $q.defer();

      var url = "http://nominatim.openstreetmap.org/search?format=json&city=" + city + "&country=" + country;

      $http.get(url).success(function(gpsJSON) {
        if (gpsJSON.length === 0) {
          var request = {
            error: "Bad country or city. "
          };

        } else {
          var request = {
            lat: gpsJSON[0].lat,
            lng: gpsJSON[0].lon,
            zoom: 12
          };

        }

        deferred.resolve(request);

      });
      return deferred.promise;
    }
  };
});

mapApp.controller('MapCtrl', function($rootScope, $scope, GeocodingService) {
  $scope.search = function() {


    GeocodingService.getGPSCoordinates($scope.country, $scope.city)
      .then(function(request) {

        if (request.error === null) {
          if ($scope.map === null)
            $scope.map = new L.Map('myMap');
            $scope.error = null;

          // create the tile layer with correct attribution
          var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
          var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
          var osm = new L.TileLayer(osmUrl, {
            attribution: osmAttrib
          });

          $scope.map.setView(
            new L.LatLng(
              request.lat,
              request.lng),
            request.zoom);

          $scope.map.addLayer(osm);

        } else {

          $scope.error = request.error;

        }

      });
  };
});

mapApp.directive('searchingForm', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "searching-form.html"
  };
});