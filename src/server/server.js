require('dotenv').config(); // Load environment variables

const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); 
const bodyParser = require('body-parser'); 
const app = express();
const port = 8081;

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME || 'r.h.hamad';
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY || 'c8134328ada342308b9a66795c40b416';
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '45735218-2abaf771650dadc5640977489';


app.use(express.static('dist'));
app.use(bodyParser.json()); // Support JSON encoded bodies

// Serve the index.html from the dist folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// POST route to handle form submission and make API calls
app.post('/api/trip', async (req, res) => {
  const { city } = req.body;
  console.log('City received from client:', city);

  try {
    // Fetch data from GeoNames
    const geoResponse = await fetch(`http://api.geonames.org/searchJSON?q=${city}&maxRows=10&username=${GEONAMES_USERNAME}`);
    const geoData = await geoResponse.json();
    console.log('GeoNames API response:', geoData);

    if (geoData.geonames && geoData.geonames.length > 0) {
      const location = geoData.geonames[0];
      const lat = location.lat;
      const lon = location.lng;

      // Fetch weather from Weatherbit
      const weatherResponse = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`);
      const weatherData = await weatherResponse.json();
      console.log('Weatherbit API response:', weatherData);

      // Fetch image from Pixabay
      const imageResponse = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(city)}&image_type=photo`);
      const imageData = await imageResponse.json();
      console.log('Pixabay API response:', imageData);

      // Construct the response object
      const tripData = {
        weather: weatherData.data && weatherData.data.length > 0 ? weatherData.data[0].weather.description : 'No weather data',
        imageUrl: imageData.hits && imageData.hits.length > 0 ? imageData.hits[0].webformatURL : 'No image found'
      };

      console.log('Final trip data sent to client:', tripData);

      // Send the response back to the client
      res.json(tripData);
    } else {
      console.log('Location not found');
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
