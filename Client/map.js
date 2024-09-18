// map.js

// Create the map
const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([0, 0]),
    zoom: 3,
  }),
});

// Function to clear all previous layers (except for the base layer)
function clearLayers() {
  const layersToRemove = [];
  map.getLayers().forEach((layer) => {
    if (layer instanceof ol.layer.Vector) {
      layersToRemove.push(layer);
    }
  });
  layersToRemove.forEach((layer) => map.removeLayer(layer));
}

// Function to add locations to the map
function addLocationsToMap(locations, countryCode = null) {
  console.log("Adding locations to map...");

  // Clear previous layers
  clearLayers();
  
  let filteredLocations = locations;

  if (countryCode && countriesGeoJson.features) {
    const cleanCountryCode = removeExtraQuotes(countryCode);
    console.log("Filtering locations for country code:", cleanCountryCode);

    const countryFeature = countriesGeoJson.features.find(
      (feature) => feature.properties.ISO_A2 === cleanCountryCode
    );

    if (countryFeature) {
      filteredLocations = locations.filter((loc) => {
        const point = turf.point([loc.longitude, loc.latitude]);
        const inside = turf.booleanPointInPolygon(point, countryFeature);
        return inside;
      });
    }
  }

  console.log("Filtered locations:", filteredLocations);

  if (filteredLocations.length === 0) {
    addNoLocationsMessage();
  } else {
    const vectorSource = new ol.source.Vector({
      features: filteredLocations.map((loc) => {
        return new ol.Feature({
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat([loc.longitude, loc.latitude])
          ),
          name: loc.name,
        });
      }),
    });

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: new ol.style.Style({
        image: new ol.style.Icon({
          src: 'images/starbucks_cup.jpg', // Ensure this path is correct
          scale: 0.2,
        }),
      }),
    });

    map.addLayer(vectorLayer);

    const center = calculateCenter(filteredLocations);
    if (center) {
      map.getView().setCenter(ol.proj.fromLonLat(center));
      map.getView().setZoom(6);
    }
  }
}

// Function to add a message to the map
function addNoLocationsMessage() {
  clearLayers();
  console.log('No locations available');

  const noLocationsMessage = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([0, 0])),
    name: 'No Starbucks in this country',
  });

  const vectorSource = new ol.source.Vector({
    features: [noLocationsMessage],
  });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      text: new ol.style.Text({
        text: 'No Starbucks in this country',
        font: 'bold 16px Arial',
        fill: new ol.style.Fill({
          color: '#FF0000',
        }),
        stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 2,
        }),
      }),
    }),
  });

  map.addLayer(vectorLayer);
}

// Function to remove extra quotes
function removeExtraQuotes(code) {
  return code.replace(/^"|"$/g, '');
}

// Calculate the average location
function calculateCenter(locations) {
  if (locations.length === 0) return null;

  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
  locations.forEach(loc => {
    minLat = Math.min(minLat, loc.latitude);
    maxLat = Math.max(maxLat, loc.latitude);
    minLon = Math.min(minLon, loc.longitude);
    maxLon = Math.max(maxLon, loc.longitude);
  });

  return [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
}
