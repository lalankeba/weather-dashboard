import apiKey from "./apikey.js";

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const baseImageUrl = 'https://openweathermap.org/img/w';
const baseForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchUnit = document.getElementById("search-unit");
const weatherContainer = document.getElementById("weather-container");
const errorContainer = document.getElementById("error-container");
const forecastContainer = document.getElementById("forecast-container");
const forecastDetailsContainer = document.getElementById("forecast-details-container");

weatherContainer.hidden = true;
errorContainer.hidden = true;
forecastContainer.style.display = "none";

const search = () => {
    const city = searchInput.value;
    const unit = searchUnit.value;
    getWeatherDataForCity(city, unit);
    getForecastDataForCity(city, unit);

    searchInput.value = '';
}

const getWeatherDataForCity = (city, unit) => {
    if (city === undefined || city === '') {
        displayError('Enter city name before searching');
    } else {
        const url = getWeatherUrlForCity(city, unit);
        getWeatherData(url, unit);
    }
}

const displayWeather = (data, unit) => {
    weatherContainer.hidden = false;
    errorContainer.hidden = true;

    const currentTime = document.getElementById("current-time");
    const cityName = document.getElementById("city-name");
    const weatherIcon = document.getElementById("weather-icon");
    const temperature = document.getElementById("temperature");
    const feelsLike = document.getElementById("feels-like");
    const weatherDescription = document.getElementById("weather-description");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");
    const pressure = document.getElementById("pressure");

    const imageUrl = `${baseImageUrl}/${data.weather[0].icon}.png`;

    let temperatureUnit = '&deg;C';
    let humidityUnit = '%';
    let windSpeedUnit = 'm/s';
    if (unit === 'imperial') {
        temperatureUnit = "&deg;F";
        windSpeedUnit = 'mph';
    }
    let dateObj = new Date(data.dt * 1000);

    currentTime.innerHTML = dateObj.toDateString();
    cityName.innerHTML = data.name + ", " + data.sys.country;
    weatherIcon.setAttribute('src', imageUrl);
    temperature.innerHTML = Math.round(data.main.temp) + temperatureUnit;
    feelsLike.innerHTML = "Feels like " + Math.round(data.main.feels_like) + temperatureUnit;
    weatherDescription.innerHTML = data.weather[0].description;
    humidity.innerHTML = "Humidity: " + data.main.humidity + humidityUnit;
    windSpeed.innerHTML = "Wind: " + data.wind.speed + windSpeedUnit;
    pressure.innerHTML = "Pressure: " + data.main.pressure + "hPa";
}

const getForecastDataForCity = (city, unit) => {
    if (city === undefined || city === '') {
        displayError('Enter city name before searching');
    } else {
        const url = getForecastUrlForCity(city, unit);
        getForecastData(url, unit);
    }
}

const displayForecast = (data, unit) => {
    forecastContainer.style.display = "block";

    const forecastDataArray = data.list;

    let temperatureUnit = '&deg;C';
    if (unit === 'imperial') {
        temperatureUnit = "&deg;F";
    }
    forecastDetailsContainer.innerHTML = '';

    forecastDataArray.map( (forecastData) => {
        let forecastDateTime = getForecastDateTime(forecastData.dt);
        
        const forecastDataContainer = document.createElement("div");
        const forecastTime = document.createElement("p");
        const forecastImage = document.createElement("img");
        const forecastTemperature = document.createElement("h4");

        const imageUrl = `${baseImageUrl}/${forecastData.weather[0].icon}.png`;
        const temperatureWithUnit = `${Math.round(forecastData.main.temp)}${temperatureUnit}`;

        forecastDataContainer.classList.add("forecast-data-container");
        forecastTime.innerHTML = `${forecastDateTime}`;
        forecastImage.setAttribute('src', imageUrl);
        forecastTemperature.innerHTML = `${temperatureWithUnit}`;

        forecastDataContainer.appendChild(forecastTime);
        forecastDataContainer.appendChild(forecastImage);
        forecastDataContainer.appendChild(forecastTemperature);

        forecastDetailsContainer.appendChild(forecastDataContainer);
    });
}

const getForecastDateTime = (dataUtcTime) => {
    let dateObj = new Date(dataUtcTime * 1000);
    let dateUtcString = dateObj.toUTCString();
    return dateUtcString.substring(0, 3) + " | " + dateUtcString.substring(17, 22);
}

const displayError = (message) => {
    weatherContainer.hidden = true;
    errorContainer.hidden = false;
    forecastContainer.style.display = "none";

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

const getWeatherDataForCoordiates = (longitude, latitude, unit) => {
    if (longitude === undefined || longitude === '' || latitude === undefined || latitude === '') {
        displayError('Enter city name before searching');
    } else {
        const url = getWeatherUrlForCoordinates(longitude, latitude, unit);
        getWeatherData(url, unit);
    }
}

const getForecastDataForCoordiates = async (longitude, latitude, unit) => {
    if (longitude === undefined || longitude === '' || latitude === undefined || latitude === '') {
        displayError('Enter city name before searching');
    } else {
        const url = getForecastUrlForCoordinates(longitude, latitude, unit);
        getForecastData(url, unit);
    }
}

const getWeatherData = async (url, unit) => {
    try {
        const weatherResponse = await fetch(url);

        if (weatherResponse.status == 200) {
            const weatherData = await weatherResponse.json();
            displayWeather(weatherData, unit);
        } else if (weatherResponse.status == 404) {
            displayError('No results found');
        } else {
            displayError('Something unexpected happened');
        }
        
    } catch (error) {
        console.log('Error occurred', error);
    }
}

const getForecastData = async (url, unit) => {
    try {
        const forecastResponse = await fetch(url);

        if (forecastResponse.status == 200) {
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData, unit);
        } else if (forecastResponse.status == 404) {
            displayError('No results found');
        } else {
            displayError('Something unexpected happened');
        }
        
    } catch (error) {
        console.log('Error occurred', error);
    }
}

const getWeatherUrlForCity = (city, unit) => {
    const cityParam = `q=${city.trim()}`;
    const unitParam = `units=${unit}`;
    const appIdParam = `appid=${apiKey}`;
    const url = `${baseUrl}?${cityParam}&${unitParam}&${appIdParam}`;
    return url;
}

const getWeatherUrlForCoordinates = (longitude, latitude, unit) => {
    const lonParam = `lon=${longitude}`;
    const latParam = `lat=${latitude}`;
    const unitParam = `units=${unit}`;
    const appIdParam = `appid=${apiKey}`;
    const url = `${baseUrl}?${lonParam}&${latParam}&${unitParam}&${appIdParam}`;
    return url;
}

const getForecastUrlForCity = (city, unit) => {
    const cityParam = `q=${city.trim()}`;
    const unitParam = `units=${unit}`;
    const appIdParam = `appid=${apiKey}`;
    const url = `${baseForecastUrl}?${cityParam}&${unitParam}&${appIdParam}`;
    return url;
}

const getForecastUrlForCoordinates = (longitude, latitude, unit) => {
    const lonParam = `lon=${longitude}`;
    const latParam = `lat=${latitude}`;
    const unitParam = `units=${unit}`;
    const appIdParam = `appid=${apiKey}`;
    const url = `${baseForecastUrl}?${lonParam}&${latParam}&${unitParam}&${appIdParam}`;
    return url;
}

// get current geo location
const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(successLocationCallback, errorLocationCallback);
    } else {
        displayError('Geolocation is not available. Please enter city name and search.');
    }
}

const successLocationCallback = (position) => {
    const unit = searchUnit.value;
    getWeatherDataForCoordiates(position.coords.longitude, position.coords.latitude, unit);
    getForecastDataForCoordiates(position.coords.longitude, position.coords.latitude, unit);
}

const errorLocationCallback = (error) => {
    console.log(error);
    displayError('User denied Geolocation. Please enter city name and search.');
}

getCurrentLocation();