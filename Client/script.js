// URL לנתוני הסניפים
const locationsUrl = "https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json";

// URL לנתוני גבולות המדינות
const countriesGeoJsonUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// URL לנתוני שמות וקודים של המדינות
const countriesNameUrl = "https://gist.githubusercontent.com/keeguon/2310008/raw/bdc2ce1c1e3f28f9cab5b4393c7549f38361be4e/countries.json";

// יצירת המפה
const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([0, 0]),
    zoom: 2,
  }),
});

// פונקציה להסרת HTML entities
function decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// פונקציה לתקן פורמט JSON לא תקני
function fixJson(text) {
  // Replace single quotes with double quotes
  text = text.replace(/'/g, '"');
  // Ensure that property names are enclosed in double quotes
  text = text.replace(/([{,]\s*)(\w+)(:)/g, '$1"$2"$3');
  return text;
}

// הורדת נתוני המדינות ושמותיהם
let countries = [];
async function fetchCountries() {
  try {
    const response = await fetch(countriesNameUrl);
    let textData = await response.text();  // Get raw text data

    // Decode HTML entities
    textData = decodeHtmlEntities(textData);

    console.log('Decoded country data:', textData);

    try {
      // Fix JSON format
      textData = fixJson(textData);

      const data = JSON.parse(textData);

      countries = data.map(country => ({
        code: country.code, // הקוד נשמר כ"קוד"
        name: country.name
      }));

      // Update dropdown and list
      updateCountrySelect();
      updateCountryList();

      console.log('Processed countries:', countries);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      alert('Error parsing JSON: ' + parseError.message);
    }
  } catch (fetchError) {
    console.error('Error fetching countries:', fetchError);
    alert('Error fetching countries: ' + fetchError.message);
  }
}

// עדכון רשימת המדינות בתפריט הבחירה
function updateCountrySelect() {
  const countrySelect = document.getElementById('countrySelect');
  countrySelect.innerHTML = '<option value="">All Countries</option>'; // Reset options

  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code; // Remove quotes
    option.textContent = country.name;
    countrySelect.appendChild(option);
  });
}

// עדכון רשימת המדינות בתצוגה מתחת למפה
function updateCountryList() {
  const countryListUl = document.getElementById('countryListUl');
  countryListUl.innerHTML = ''; // Clear existing list

  countries.forEach(country => {
    const listItem = document.createElement('li');
    listItem.textContent = `${country.name} ("${country.code}")`;
    countryListUl.appendChild(listItem);
  });
}

fetchCountries();

// הורדת נתוני הסניפים
let locations = [];
fetch(locationsUrl)
  .then((response) => response.json())
  .then((data) => {
    locations = data;
    addLocationsToMap(locations);
  })
  .catch((error) => {
    console.error("Error fetching locations:", error);
  });

// הורדת נתוני גבולות המדינות
let countriesGeoJson = {};
fetch(countriesGeoJsonUrl)
  .then((response) => response.json())
  .then((data) => {
    countriesGeoJson = data;
  })
  .catch((error) => {
    console.error("Error fetching countries GeoJSON:", error);
  });

// פונקציה לניקוי כל השכבות הקודמות (מלבד שכבת הבסיס)
function clearLayers() {
  const layersToRemove = [];
  map.getLayers().forEach((layer) => {
    if (layer instanceof ol.layer.Vector) {
      layersToRemove.push(layer);
    }
  });
  layersToRemove.forEach((layer) => map.removeLayer(layer));
}

// פונקציה להוספת הודעה על המפה
function addNoLocationsMessage() {
  // ניקוי כל השכבות הקודמות
  clearLayers();
  alert('No Starbucks in this country');
  const noLocationsMessage = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([0, 0])), // מיקום מרכזי
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
          color: '#FF0000', // צבע הטקסט
        }),
        stroke: new ol.style.Stroke({
          color: '#FFFFFF', // צבע הקווים סביב הטקסט
          width: 2,
        }),
      }),
    }),
  });

  map.addLayer(vectorLayer);
}

// פונקציה להוספת סניפים למפה
function addLocationsToMap(locations, countryCode = null) {
  // ניקוי כל השכבות הקודמות
  clearLayers();

  // סינון סניפים לפי מדינה אם נבחרה
  let filteredLocations = locations;
  if (countryCode && countriesGeoJson.features) {
    const cleanCountryCode = removeExtraQuotes(countryCode); // Remove extra quotes if needed

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

  if (filteredLocations.length === 0) {
    // אם לא נמצאו סניפים, הצג הודעה
    addNoLocationsMessage();
  } else {
    console.log("Filtered locations:", filteredLocations);

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
      style:Image
    });

    map.addLayer(vectorLayer);

    // חישוב מיקום ממוצע של המדינה
    const center = calculateCenter(filteredLocations);
    if (center) {
      // התמקדות במפה במיקום הממוצע
      map.getView().setCenter(ol.proj.fromLonLat(center));
      map.getView().setZoom(15); // התאמת רמת הזום
    }
  }
}

// פונקציה להוספת ציטוטים כפולים מיותרות
function removeExtraQuotes(code) {
  return code.replace(/^"|"$/g, ''); // Remove leading and trailing quotes
}

// חישוב המיקום הממוצע
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

// אירוע לשינוי המדינה בתיבת הבחירה
document.addEventListener("DOMContentLoaded", function () {
  const countrySelect = document.getElementById("countrySelect");

  if (!countrySelect) {
    console.error("Country select element not found on DOMContentLoaded");
    return;
  }

  countrySelect.addEventListener("change", (event) => {
    const selectedCountry = event.target.value;
    console.log("Selected country:", selectedCountry);
    addLocationsToMap(locations, selectedCountry); // Remove extra quotes before filtering
  });
});

// הודעת בדיקה לטעינת Turf.js
console.log("Turf.js loaded:", typeof turf !== "undefined");
