// OpenWeather API Key
import { WEATHER_APP_API_KEY } from "./config.mjs";

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');


// Use the navigator object to retrieve the user’s geolocation
window.addEventListener('load', () => {
    // Create lat and lon values
    let lon;
    let lat;
    //access users location
    // The if(navigator.geolocation) method checks and sees if an object can be retrieved by the browser
    if(navigator.geolocation) {
        // getCurrentPosition is used from the geolocation property. The position variable is then passed into a function
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            const currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_APP_API_KEY}&units=metric`;
            const forecastWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=21&appid=${WEATHER_APP_API_KEY}&units=metric`;

        // Using fetch to get current weather data
        fetch(currentWeather)
            .then((response) => {
            return response.json();
            })
            .then((data) => {
                
                const { temp } = data.main;
                const place = data.name;
                const { description, icon } = data.weather[0];
                const { sunrise, sunset } = data.sys;

                const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                const fahrenheit = (temp * 9) / 5 + 32;

                // Converting Epoch(Unix) time to GMT
                const sunriseGMT = new Date(sunrise * 1000);
                const sunsetGMT = new Date(sunset * 1000);

                // Interacting with DOM to show data
                iconImg.src = iconUrl;
                loc.textContent = `${place}`;
                desc.textContent = `${description}`;
                tempC.textContent = `${temp.toFixed(1)} °C`;
                tempF.textContent = `${fahrenheit.toFixed(1)} °F`;
                sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
                sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
            });
        

        // Using fetch to get forecast weather data
            fetch(forecastWeather)
            .then((response) => {
            return response.json();
            })
            .then((data) => {
                var count = 1;
                data.list.slice(0,8).forEach(function(item) {
                    
                    const date = item.dt;
                    const { temp } = item.main;
                    const conition = item.weather[0].description;
                    const icon = item.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

                    const fahrenheit = (temp * 9) / 5 + 32;

                    var dateGMT = new Date(date * 1000);
                    var finalDate = dateGMT.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                    var li = document.createElement('li');
                    li.innerHTML = '<div>'+ finalDate + '</div><img class="forecast-icon" src='+iconUrl+'></img><div id="forecast-desc" style="text-transform: capitalize">'+ conition +'</div><div class="forecast-weather"><div class="c">'+temp.toFixed(1)+'°C</div> <div class="f">' + fahrenheit.toFixed(1) + '°F</div></div>'
                    document.getElementById("forecastList").appendChild(li);
                });
            });
        });
    }
});