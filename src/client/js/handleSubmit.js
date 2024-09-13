const tripDetails = {};

// Object to store API keys
let apiCredentials = {};

// Fetch API keys from the server
async function fetchApiCredentials() {
    try {
        const response = await fetch('/api/keys');
        if (!response.ok) throw new Error('Failed to fetch API keys');
        apiCredentials = await response.json();
    } catch (error) {
        console.error('Error fetching API credentials:', error);
    }
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission

    // Fetch API credentials if not already fetched
    if (!apiCredentials.geoNamesUsername) {
        await fetchApiCredentials();
    }

    // Get user input
    tripDetails['city'] = document.getElementById('city').value;
    tripDetails['date'] = document.getElementById('date').value;
    tripDetails['daysUntil'] = calculateDaysUntil(tripDetails['date']);

    try {
        // Fetch geographic details
        const geoData = await fetchGeoData(tripDetails['city']);
        // console.log('Geographic data:', geoData);

        if (geoData.geonames && geoData.geonames.length > 0) {
            const { lat, lng } = geoData.geonames[0];

            // Fetch weather data
            const weatherData = await fetchWeatherData(lat, lng, tripDetails['date']);
            // console.log('Weather data:', weatherData);

            if (weatherData.data && weatherData.data.length > 0) {
                // Find the weather data for the specific date
                const weatherForDate = weatherData.data.find(item => item.valid_date === tripDetails['date']);
                
                if (weatherForDate) {
                    tripDetails['temperature'] = weatherForDate.temp;
                    tripDetails['weatherDescription'] = weatherForDate.weather.description;
                } else {
                    throw new Error('No weather data available for the specified date');
                }
            } else {
                throw new Error('No weather data available');
            }

            // Fetch city image
            const imageData = await fetchCityImage(tripDetails['city']);
            tripDetails['cityImageUrl'] = imageData.hits && imageData.hits.length > 0
                ? imageData.hits[0].webformatURL
                : 'https://via.placeholder.com/150'; // Default image

            // Post details and update UI
            const response = await postTripData(tripDetails);
            // console.log('tripDetails:', tripDetails);
            updateUserInterface(tripDetails);
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



// Fetch geographic details from GeoNames API
async function fetchGeoData(city) {
    const response = await fetch(`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${apiCredentials.geoNamesUsername}`);
    return response.json();
}

// Fetch weather data from Weatherbit API
async function fetchWeatherData(lat, lng, date) {
    const tripDateTimestamp = Math.floor(new Date(date).getTime() / 1000);
    const todayTimestamp = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);

    let url;
    if (tripDateTimestamp < todayTimestamp) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        url = `https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${lng}&start_date=${date}&end_date=${nextDate.toISOString().split('T')[0]}&key=${apiCredentials.weatherbitKey}`;
    } else {
        url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${apiCredentials.weatherbitKey}`;
    }

    // console.log('Fetching weather data from URL:', url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', response.status, errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const weatherData = await response.json();
        // console.log('Weather data received:', weatherData);
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}


// Fetch city image from Pixabay API
async function fetchCityImage(city) {
    const response = await fetch(`https://pixabay.com/api/?key=${apiCredentials.pixabayAPIKey}&q=${city} city&image_type=photo`);
    return response.json();
}

// Post trip details to the server
async function postTripData(details) {
    const response = await fetch('http://localhost:9090/postData', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(details)
    });
    return response.json();
}

// Update the UI with the fetched data
function updateUserInterface(data) {
    // console.log('Updating UI with data:', data); // Log the data being used

    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.style.display = 'block';
    } else {
        console.error('Results section not found');
    }

    const weatherElement = document.getElementById('weather');
    if (weatherElement) {
        weatherElement.textContent = data.weatherDescription || 'Weather data not available';
    } else {
        console.error('Weather element not found');
    }

    const imageElement = document.getElementById('image');
    if (imageElement) {
        imageElement.src = data.cityImageUrl || 'https://via.placeholder.com/150'; // Default image
    } else {
        console.error('Image element not found');
    }
}


// Calculate the number of days between today and the provided date
function calculateDaysUntil(targetDate) {
    const targetDateObject = new Date(targetDate);
    const todayDateObject = new Date();
    return Math.floor((Date.UTC(targetDateObject.getFullYear(), targetDateObject.getMonth(), targetDateObject.getDate()) - Date.UTC(todayDateObject.getFullYear(), todayDateObject.getMonth(), todayDateObject.getDate())) / (1000 * 60 * 60 * 24));
}

// Add event listener to form submission
// document.getElementById('trip').addEventListener('submit', handleSubmit);

export {
    handleSubmit
};
