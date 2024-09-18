// data.js

// Fetch country data and their names
async function fetchCountries() {
    try {
      const response = await fetch(COUNTRIES_NAME_URL);
      let textData = await response.text();
  
      textData = decodeHtmlEntities(textData);
      textData = fixJson(textData);
  
      const data = JSON.parse(textData);
      countries = data.map(country => ({
        code: country.code,
        name: country.name
      }));
  
      updateCountrySelect();
      updateCountryList();
    } catch (error) {
      console.error('Error fetching countries:', error);
      alert('Error fetching countries: ' + error.message);
    }
  }
  
  // Fetch branch data
  async function fetchLocations() {
    try {
      const response = await fetch(LOCATIONS_URL);
      locations = await response.json();
      addLocationsToMap(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }
  
  // Fetch country boundaries data in GeoJSON format
  async function fetchCountriesGeoJson() {
    try {
      const response = await fetch(COUNTRIES_GEOJSON_URL);
      countriesGeoJson = await response.json();
    } catch (error) {
      console.error("Error fetching countries GeoJSON:", error);
    }
  }
  
  // Function to decode HTML entities
  function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
  
  function fixJson(text) {
    text = text.replace(/'/g, '"');
    text = text.replace(/([{,]\s*)(\w+)(:)/g, '$1"$2"$3');
    return text;
  }
  
  // Execute functions to fetch data
  fetchCountries();
  fetchLocations();
  fetchCountriesGeoJson();
