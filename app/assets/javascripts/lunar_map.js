var map;
var DEFAULT_OPTIONS = { lat: 0.681400, lng: 23.460550, title: 'Apollo 11' };
var RADIUS = 1738000; //in meter
var METER_TO_MILES = 0.000621371;

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 1,
    streetViewControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['moon']
    }
  });
  var moonMapType = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      var normalizedCoord = getNormalizedCoord(coord, zoom);
      if (!normalizedCoord) {
        return null;
      }
      var bound = Math.pow(2, zoom);
      return '//mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw' +
          '/' + zoom + '/' + normalizedCoord.x + '/' +
          (bound - normalizedCoord.y - 1) + '.jpg';
  },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 9,
    minZoom: 0,
    radius: RADIUS,
    name: 'Moon'
  });

  map.mapTypes.set('moon', moonMapType);
  map.setMapTypeId('moon');
  setStyle();
  map.data.addGeoJson(coords(DEFAULT_OPTIONS));
}

function coords(options) {
 return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [parseFloat(options.lat), parseFloat(options.lng)] },
      properties: { name: options.title }
    }]
  }
}

function setStyle() {
  map.data.setStyle(function(feature) {
    return {
      title: feature.getProperty('name'),
      optimized: false
    };
  });
}

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
  var y = coord.y;
  var x = coord.x;

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  var tileRange = 1 << zoom;

  // don't repeat across y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    return null;
  }

  // repeat across x-axis
  if (x < 0 || x >= tileRange) {
    x = (x % tileRange + tileRange) % tileRange;
  }

  return {x: x, y: y};
}

// Used Spherical Law of Cosines                
function calculateDistance(options) {
  var ct = Math.PI/180.0;
  lat1 = DEFAULT_OPTIONS.lat * ct;
  lng1 = DEFAULT_OPTIONS.lng * ct;
  lat2 = options.lat * ct;
  lng2 = options.lng * ct;
  var R = RADIUS * METER_TO_MILES; // in miles
  var d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + 
                  Math.cos(lat1)*Math.cos(lat2) *
                  Math.cos(lng2-lng1)) * R; // in miles
  $("#distance").text(d.toFixed(2).concat(' miles'));
}


$(document).on('change', '#vehicle_id', function(){
  $.get("/lunar_vehicle_map/".concat(this.value), function(data) {
    $('#vehicle_lat').val(data.lat);
    $('#vehicle_lng').val(data.long);
    $('#vehicle_name').val(data.name);
  })
  .fail(function(xhr, textStatus, error) {
    $(".message").html(error).addClass('error').fadeOut(2500);
  })
});

$(document).on('click', '#locate', function() {
  options = { lat: $('#vehicle_lat').val(), lng: $('#vehicle_lng').val(), title: $('#vehicle_name').val() };
  initMap();
  setTimeout(function() {
    map.data.addGeoJson(coords(options));
  }, 500);
  calculateDistance(options)
});
