# Starbucks Map Application

## Project Overview
This web application displays Starbucks locations on a map using OpenLayers for map rendering and Turf.js for geospatial operations. The project is containerized with Docker to ensure consistency across different environments.

## Project Structure
- `Client/`: Front-end code and assets
- `Server/`: Back-end code and server configuration
- `Dockerfile`: Docker image build instructions
- `docker-compose.yml`: Docker container orchestration
- `my-server-image.tar`: Built Docker image for the server

## Data Sources
- Starbucks Locations: [URL]
- Countries Boundaries: [URL]
- Countries Names and Codes: [URL]

## Features
1. Map Initialization
   - Uses OpenLayers with OpenStreetMap as the base layer
   - Initial center at [0, 0] with zoom level 2

2. Data Fetching and Parsing
   - Fetches and parses country names, boundaries, and Starbucks locations
   - Handles HTML entity decoding and JSON format issues

3. Displaying Starbucks Locations
   - Adds locations to the map
   - Filters based on selected country

4. No Locations Handling
   - Displays a message when no Starbucks locations are found in a country

5. Dynamic Updates
   - Updates country list and dropdown menu
   - Reacts to user selections

## Design and Branding
- Color scheme: Starbucks green (#005127, #007a33) with neutral tones
- Minimalistic layout with a focus on user interface clarity
- Starbucks-branded imagery for map markers

## Docker Configuration
- `Dockerfile`: Defines the Docker image build
- `docker-compose.yml`: Manages container configuration
- `my-server-image.tar`: Pre-built Docker image for the server

## Code Overview
- Data Fetching Functions: `fetchCountries()`, `fetch(locationsUrl)`, `fetch(countriesGeoJsonUrl)`
- Map Functions: `clearLayers()`, `addNoLocationsMessage()`, `addLocationsToMap()`, `removeExtraQuotes()`, `calculateCenter()`
- Event Handling: Manages country selection and map updates

## Running the Application Locally

1. Install Dependencies:
   ```bash
   cd Server
   npm install

2. Start the Application:
   ```bash
   npm start
   
3.Access the Application:
Open a web browser and go to http://localhost:3000

## Issues and Resolutions
- Initial challenge with ISO_A2 and ISO_A3 country codes resolved
- Docker integration issues have been addressed
  
## Note
This project uses ISO_A2 (2-letter) country codes for data handling and filtering.

## Contact

Let's connect on LinkedIn: [Bar Harush](https://www.linkedin.com/in/bar-harush/)
