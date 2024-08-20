const apiKey = '8f381da88b7180ba9de71ea83abc7a49';
const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location-input');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherContainer = document.querySelector('.current-weather');
const loadingSpinner = document.getElementById('loading-spinner');
const weatherIcon = document.getElementById('weather-icon');
const forecastContainer = document.getElementById('forecast-container');
const forecastSection = document.querySelector('.forecast');

searchBtn.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        weatherContainer.classList.add('hidden');
        forecastSection.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        getWeather(location);
    }
});

function getWeather(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            loadingSpinner.classList.add('hidden');
            if (data.cod === 200) {
                updateWeatherUI(data);
                getForecast(data.coord.lat, data.coord.lon);
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            loadingSpinner.classList.add('hidden');
            console.error('Error fetching the weather data:', error);
        });
}

function updateWeatherUI(data) {
    const { name, sys, main, weather, wind } = data;

    locationName.textContent = `${name}, ${sys.country}`;
    temperature.textContent = `${main.temp}°C`;
    weatherDescription.textContent = weather[0].description;
    humidity.textContent = `Humidity: ${main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${wind.speed} m/s`;

    weatherIcon.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    weatherContainer.classList.remove('hidden');
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            updateForecastUI(data);
        })
        .catch(error => {
            console.error('Error fetching the forecast data:', error);
        });
}

function updateForecastUI(data) {
    forecastContainer.innerHTML = '';
    const forecastData = data.list.filter((item, index) => index % 8 === 0);

    forecastData.forEach(day => {
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-day');
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        forecastElement.innerHTML = `
            <h3>${date}</h3>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastElement);
    });

    forecastSection.classList.remove('hidden');
}
