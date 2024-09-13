let projectData = {};

const express = require('express');
const app = express();

require('dotenv').config();


const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../../config/dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../config/dist', 'index.html'));
});


// Handle POST 
app.post('/postData', function (req, res) {
    // Extracting data 
    projectData['city'] = req.body.city;
    projectData['date'] = req.body.date;
    projectData['temperature'] = req.body.temperature;
    projectData['weather_condition'] = req.body.weather_condition;
    projectData['cityImage'] = req.body.cityImage;
    projectData['daysUntil'] = req.body.daysUntil; 

    // Send back the project data
    res.send(projectData);
});

// API keys endpoints
const apiKeys = {
     geoNamesUsername :process.env.GEONAMES_USERNAME,
     weatherbitKey : process.env.WEATHERBIT_API_KEY,
     pixabayAPIKey : process.env.PIXABAY_API_KEY,
};

app.get('/api/keys', (req, res) => {
    res.json(apiKeys);

});
// Start server
app.listen(9090, () => {
    console.log('Server is running on port 9090');
});

module.exports = app;
