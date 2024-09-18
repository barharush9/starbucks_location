const express = require('express');
const turf = require('@turf/turf');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'Client' directory
app.use(express.static(path.join(__dirname, '..', '..', 'Client')));
// Serve static files including images from the Client directory
app.use('/images', express.static(path.join(__dirname, '..', '..', 'Client', 'images')));

// Example endpoint to check if a point is within a country
app.post('/check-location', (req, res) => {
  const { longitude, latitude, countryCode, countryGeoJson } = req.body;

  if (!longitude || !latitude || !countryCode || !countryGeoJson) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const point = turf.point([longitude, latitude]);
  const countryFeature = countryGeoJson.features.find(
    (feature) => feature.properties.ISO_A2 === countryCode
  );

  if (!countryFeature) {
    return res.status(404).json({ error: 'Country not found' });
  }

  const isInside = turf.booleanPointInPolygon(point, countryFeature);

  res.json({ isInside });
});

// Fallback to index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'Client', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
