var map;

$(document).on('change', '#vehicle_id', function(){
  $.get("/lunar_vehicle_map/".concat(this.value), function(data) {
    $('#vehicle_lat').val(data.lat);
    $('#vehicle_lng').val(data.long);
     
  })
  .fail(function() {
    console.log( "error" );
  })
});

var options = { lat: 0.681400, lng: 23.460550 };

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.681400, lng: 23.460550},
    zoom: 2,
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
    radius: 1738000,
    name: 'Moon'
  });

  map.mapTypes.set('moon', moonMapType);
  map.setMapTypeId('moon');
  map.data.addGeoJson(coords(options));
}

function coords(options) {
 return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [parseFloat(options.lat), parseFloat(options.lng)] },
      properties: { name: 'Apollo 11' }
    }]
  }
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
