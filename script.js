const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const baseImageUrl = 'https://openweathermap.org/img/w';
const apiKey = 'a6c804b5fbd6dfe772e60831dc3b5e4f';

const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchUnit = document.getElementById("search-unit");
const weatherContainer = document.getElementById("weather-container");
const errorContainer = document.getElementById("error-container");

weatherContainer.hidden = true;
errorContainer.hidden = true;

const search = () => {
    const city = searchInput.value;
    const unit = searchUnit.value;
    getWeatherData(city, unit);
}

const getWeatherData = async (city, unit) => {
    if (city === undefined || city === '') {
        displayError('Enter city name before searching');
    } else {
        const cityParam = `q=${city.trim()}`;
        const unitParam = `units=${unit}`;
        const appIdParam = `appid=${apiKey}`;
        const url = `${baseUrl}?${cityParam}&${unitParam}&${appIdParam}`;

        try {
            const weatherResponse = await fetch(url);

            if (weatherResponse.status == 200) {
                const weatherData = await weatherResponse.json();
                console.log(weatherData);

                displayWeather(weatherData, unit);
            } else if (weatherResponse.status == 404) {
                displayError('No results for ' + city);
            } else {
                displayError('Something unexpected happened');
            }
            
        } catch (error) {
            console.log('Error occurred', error);
        }
    }
}

const displayWeather = (data, unit) => {
    weatherContainer.hidden = false;
    errorContainer.hidden = true;

    const cityName = document.getElementById("city-name");
    const weatherIcon = document.getElementById("weather-icon");
    const temperature = document.getElementById("temperature");
    const weatherDescription = document.getElementById("weather-description");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");

    const imageUrl = `${baseImageUrl}/${data.weather[0].icon}.png`;

    let temperatureUnit = '&deg;C';
    let humidityUnit = '%';
    let windSpeedUnit = 'm/s';
    if (unit === 'imperial') {
        temperatureUnit = "&deg;F";
        windSpeedUnit = 'mph';
    }

    cityName.innerHTML = data.name + ", " + data.sys.country;
    weatherIcon.setAttribute('src', imageUrl);
    temperature.innerHTML = data.main.temp + temperatureUnit;
    weatherDescription.innerHTML = data.weather[0].description;
    humidity.innerHTML = "Humidity " + data.main.humidity + humidityUnit;
    windSpeed.innerHTML = "Wind speed " + data.wind.speed + windSpeedUnit;

    searchInput.value = '';
}

const displayError = (message) => {
    weatherContainer.hidden = true;
    errorContainer.hidden = false;

    const errorDescription = document.getElementById("error-description");
    errorDescription.innerHTML = message;

    searchInput.value = '';
}

searchBtn.addEventListener('click', search);
searchInput.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        search();
    }
});

// get current location

const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(successLocationCallback, errorLocationCallback);
    } else {
        console.log("geolocation is not available");
    }
}

const successLocationCallback = (position) => {
    console.log(position);
}

const errorLocationCallback = (error) => {
    console.log(error);
}

getCurrentLocation();