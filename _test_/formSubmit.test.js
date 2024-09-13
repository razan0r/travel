import { handleSubmit } from '../src/client/js/handleSubmit'; 

// Mock API
global.fetch = jest.fn();

// Set up a mock for the DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Travel App</title>
        </head>
        <body>
            <h1>Travel App</h1>
            <form id="trip">\
                <label for="city">City:</label>
                <input type="text" id="city" name="city" value="Paris" required>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" value="2024-09-13" required>
                <button type="submit">Submit</button>
            </form>
            <div id="results">
                <p id="weather"></p>
                <img id="image" src="https://via.placeholder.com/150" alt="Location Image">
            </div>
        </body>
        </html>
    `;
    // Reinitialize handleSubmit to ensure it attaches to the form
    document.getElementById('trip').addEventListener('submit', handleSubmit);
});

afterEach(() => {
    jest.resetAllMocks();
});

test('should handle form submission and update UI', async () => {
    // Mock API responses
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                geoNamesUsername: 'dummyUsername',
                weatherbitKey: 'dummyWeatherbitKey',
                pixabayAPIKey: 'dummyPixabayAPIKey'
            })
        })
    ).mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                geonames: [{ lat: 48.8566, lng: 2.3522 }]
            })
        })
    ).mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                data: [{ temp: '20°C', weather: { description: 'Sunny' } }]
            })
        })
    ).mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                hits: [{ webformatURL: 'http://example.com/paris.jpg' }]
            })
        })
    ).mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                city: 'Paris',
                date: '2024-09-13',
                temperature: '20°C',
                weatherDescription: 'Sunny',
                cityImageUrl: 'http://example.com/paris.jpg'
            })
        })
    );

    // Trigger form submission
    const form = document.getElementById('trip');
    await form.dispatchEvent(new Event('submit'));

    // Check if the UI was updated
    expect(document.getElementById('results').style.display).toBe('block');
    expect(document.getElementById('weather').textContent).toBe('Sunny');
    expect(document.getElementById('image').src).toBe('http://example.com/paris.jpg');
});
