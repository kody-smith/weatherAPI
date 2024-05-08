// import { WEATHER_APP_API_KEY } from "./config.mjs";
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

let WEATHER_APP_API_KEY = urlParams.get('key');

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');

let lon, lat;

function fetchWeatherData() {
    showLoadingIndicator(true);
    const delayTime = 500;
    setTimeout(() => {
        const currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_APP_API_KEY}&units=metric`;
        const forecastWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=21&appid=${WEATHER_APP_API_KEY}&units=metric`;

        // Fetch current weather data
        fetch(currentWeather)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
            });

        // Fetch forecast data
        fetch(forecastWeather)
            .then(response => response.json())
            .then(data => {
                updateForecastDisplay(data);
                showLoadingIndicator(false);
            });
    },delayTime);
}

function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = show ? 'block' : 'none';
}

function displayCurrentWeather(data) {
    const { temp } = data.main;
    const place = data.name;
    const { description, icon } = data.weather[0];
    const { sunrise, sunset } = data.sys;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const fahrenheit = (temp * 9) / 5 + 32;

    const sunriseGMT = new Date(sunrise * 1000);
    const sunsetGMT = new Date(sunset * 1000);

    iconImg.src = iconUrl;
    loc.textContent = place;
    desc.textContent = description;
    tempC.textContent = `${temp.toFixed(1)} °C`;
    tempF.textContent = `${fahrenheit.toFixed(1)} °F`;
    sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
    sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
}

function updateForecastDisplay(data) {
    const twentyFourHrBtn = document.getElementById('twentyFourHr');
    const fourtyEightHrBtn = document.getElementById('fourtyEightHr');

    twentyFourHrBtn.style.appearance = 'none';
    fourtyEightHrBtn.style.appearance = 'none';

    document.getElementById("forecastList").innerHTML = ""; // Clear previous content
    if (twentyFourHrBtn.checked) {
        data.list.slice(0, 8).forEach(item => {
            appendForecastItem(item);
        });
    } else if (fourtyEightHrBtn.checked) {
        data.list.slice(0, 16).forEach(item => {
            appendForecastItem(item);
        });
    }
}

function appendForecastItem(item) {
    const date = item.dt;
    const { temp } = item.main;
    const condition = item.weather[0].description;
    const icon = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const fahrenheit = (temp * 9) / 5 + 32;

    var dateGMT = new Date(date * 1000);
    var finalDate = dateGMT.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    var li = document.createElement('li');
    li.innerHTML = `<div>${finalDate}</div><img class="forecast-icon" src=${iconUrl}><div id="forecast-desc" style="text-transform: capitalize">${condition}</div><div class="forecast-weather"><div class="c">${temp.toFixed(1)}°C</div> <div class="f">${fahrenheit.toFixed(1)}°F</div></div>`;
    document.getElementById("forecastList").appendChild(li);
}

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            fetchWeatherData();
        });
    }

    const twentyFourHrBtn = document.getElementById('twentyFourHr');
    const fourtyEightHrBtn = document.getElementById('fourtyEightHr');

    twentyFourHrBtn.addEventListener('change', () => {
        if (twentyFourHrBtn.checked) {
            document.getElementById("forecastList").innerHTML = "";
            fetchWeatherData();
        };
    });

    fourtyEightHrBtn.addEventListener('change', () => {
        if (fourtyEightHrBtn.checked) {
            document.getElementById("forecastList").innerHTML = "";
            fetchWeatherData();
        };
    });
});
