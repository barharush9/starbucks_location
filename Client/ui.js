// ui.js

// Update the list of countries in the selection menu
function updateCountrySelect() {
    const countrySelect = document.getElementById('countrySelect');
    countrySelect.innerHTML = '<option value="">All Countries</option>'; // Reset options
  
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.name;
      countrySelect.appendChild(option);
    });
  }
  
  // Update the list of countries displayed below the map
  function updateCountryList() {
    const countryListUl = document.getElementById('countryListUl');
    countryListUl.innerHTML = ''; // Clear existing list
  
    countries.forEach(country => {
      const listItem = document.createElement('li');
      listItem.textContent = `${country.name} ("${country.code}")`;
      countryListUl.appendChild(listItem);
    });
  }
  
  // Event handler for country selection change
  document.addEventListener("DOMContentLoaded", function () {
    const countrySelect = document.getElementById("countrySelect");
  
    if (!countrySelect) {
      console.error("Country select element not found on DOMContentLoaded");
      return;
    }
  
    countrySelect.addEventListener("change", (event) => {
      const selectedCountry = event.target.value;
      addLocationsToMap(locations, selectedCountry);
    });
  });
