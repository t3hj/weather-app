const weatherIcons = {
    'Clear': 'wi-day-sunny',
    'Clouds': 'wi-cloudy',
    'Rain': 'wi-rain',
    'Snow': 'wi-snow',
    'Thunderstorm': 'wi-thunderstorm',
    'Drizzle': 'wi-sprinkle',
    'Atmosphere': 'wi-fog',
    'Mist': 'wi-fog',
    'Smoke': 'wi-smoke',
    'Haze': 'wi-day-haze',
    'Dust': 'wi-dust',
    'Fog': 'wi-fog',
    'Sand': 'wi-sandstorm',
    'Ash': 'wi-volcano',
    'Squall': 'wi-strong-wind',
    'Tornado': 'wi-tornado'
};

const weatherBackgrounds = {
    'Clear': 'url(images/clear-sky.jpg)',
    'Clouds': 'url(images/cloudy.jpg)',
    'Rain': 'url(images/rain.jpg)',
    'Snow': 'url(images/snow.jpg)',
    'Thunderstorm': 'url(images/thunderstorm.jpg)',
    'Drizzle': 'url(images/drizzle.jpg)',
    'Atmosphere': 'url(images/fog.jpg)',
    'Mist': 'url(images/fog.jpg)',
    'Smoke': 'url(images/smoke.jpg)',
    'Haze': 'url(images/haze.jpg)',
    'Dust': 'url(images/dust.jpg)',
    'Fog': 'url(images/fog.jpg)',
    'Sand': 'url(images/sandstorm.jpg)',
    'Ash': 'url(images/volcano.jpg)',
    'Squall': 'url(images/strong-wind.jpg)',
    'Tornado': 'url(images/tornado.jpg)'
};

document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    const apiKey = 'API-KEY'; // Your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const unsplashApiKey = 'API-KEY'; // Your Unsplash API key
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}`;

    // Clear previous weather data
    document.getElementById('weather').innerHTML = '';

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === 200) {
                const cityId = data.id;
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric`;
                return fetch(forecastUrl);
            } else {
                document.getElementById('weather').innerHTML = `<p>City not found!</p>`;
                throw new Error('City not found');
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not available');
            }
            return response.json();
        })
        .then(data => {
            const weatherDiv = document.getElementById('weather');
            const cityNameDiv = document.getElementById('cityName');
            const current = data.list[0];
            const iconClass = weatherIcons[current.weather[0].main] || 'wi-day-sunny';
            const backgroundImage = weatherBackgrounds[current.weather[0].main] || 'url(default.jpg)';
            document.getElementById('app').style.backgroundImage = backgroundImage; // Set background image of the box

            cityNameDiv.innerHTML = `<div class="glass-box"><h2>${data.city.name}</h2></div>`; // Display city name within a glass box

            let forecastHTML = `<h2>5-Day Forecast</h2>`;
            data.list.forEach((forecast, index) => {
                if (index % 8 === 0) { // Get forecast for every 24 hours (8 * 3-hour intervals)
                    const dayIconClass = weatherIcons[forecast.weather[0].main] || 'wi-day-sunny';
                    const dayBackground = weatherBackgrounds[forecast.weather[0].main] || 'rgba(255, 255, 255, 0.6)';
                    const dayName = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                    forecastHTML += `
                        <div class="forecast-day" style="background: ${dayBackground}; background-size: cover; background-position: center; background-repeat: no-repeat;">
                            <h3>${dayName}</h3>
                            <i class="wi ${dayIconClass}"></i>
                            <p>${forecast.weather[0].description}</p>
                            <p>Temp: ${forecast.main.temp}°C</p>
                        </div>
                    `;
                }
            });

            weatherDiv.innerHTML = `
                <i class="wi ${iconClass}"></i>
                <p>${current.weather[0].description}</p>
                <p>Temperature: ${current.main.temp}°C</p>
                <p>Feels Like: ${current.main.feels_like}°C</p>
                <p>Humidity: ${current.main.humidity}%</p>
                <p>Wind Speed: ${current.wind.speed} m/s</p>
                <p>Pressure: ${current.main.pressure} hPa</p>
                ${forecastHTML}
            `;

            // Reset input field value
            document.getElementById('city').value = '';

            return fetch(unsplashUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unsplash data not available');
            }
            return response.json();
        })
        .then(data => {
            if (data.results.length > 0) {
                const imageUrl = data.results[0].urls.full;
                document.body.style.backgroundImage = `url(${imageUrl})`;
                document.getElementById('cityName').style.backgroundImage = `url(${imageUrl})`; // Set background image of the city name box
            } else {
                document.body.style.backgroundImage = 'url(images/default-background.jpg)'; // Ensure this image exists
                document.getElementById('cityName').style.backgroundImage = 'url(images/default-background.jpg)'; // Ensure this image exists
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
        });
});
