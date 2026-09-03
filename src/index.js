import "./styles.css";

const API_KEY = "2LYJU4DK9EKDVFVNJ9ZNC9RYP";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("location-input");
const resolvedAddressEl = document.getElementById("resolved-address");
const currentTempEl = document.getElementById("current-temp");
const weatherConditionEl = document.getElementById("weather-condition");
const perceivedTempEl = document.getElementById("perceived-temp");
const windSpeedEl = document.getElementById("wind-speed");
const uvIndexEl = document.getElementById("uv-index");
const aqiEl = document.getElementById("aqi");
const humidityEl = document.getElementById("humidity");

// document.getElementById('resolve-location');

async function fetchWeatherData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&elements=add%3Aaqius&key=${API_KEY}&contentType=json`,
  );
  const weatherData = await response.json();
  return weatherData;
}

/* TODO
   Also put fahrenheit versions of temperatures and
   mph (miles per hour) version of wind speed to the
   returned 
*/
function formatWeatherData(data) {
  return {
    resolvedAddress: data.resolvedAddress,
    currentConditions: {
      aqius: data.currentConditions.aqius,
      conditions: data.currentConditions.conditions,
      feelslikeC: data.currentConditions.feelslike,
      feelslikeF: celciusToFahrenheit(data.currentConditions.feelslike),
      humidity: data.currentConditions.humidity,
      icon: data.currentConditions.icon,
      tempC: data.currentConditions.temp,
      tempF: celciusToFahrenheit(data.currentConditions.temp),
      uvindex: data.currentConditions.uvindex,
      windspeedKph: data.currentConditions.windspeed,
      windspeedMph: kphToMph(data.currentConditions.windspeed),
    },
  };
}

/* TODO: When user toggles unit, automatically update the 
   data without him to click Search button again.
*/

function renderWeatherData(data) {
  const { currentConditions, resolvedAddress } = data;

  resolvedAddressEl.textContent = resolvedAddress;

  /* TODO: Also display weather icon */
  const celsiusChecked = document.querySelector("#celsius").checked;
  if (celsiusChecked) {
    currentTempEl.textContent = `Temp: ${currentConditions.tempC} °C`;
    perceivedTempEl.textContent = `Feels Like: ${currentConditions.feelslikeC} °C`;
    windSpeedEl.textContent = `Wind Speed: ${currentConditions.windspeedKph} km/h`;
  } else {
    currentTempEl.textContent = `Temp: ${currentConditions.tempF} °F`;
    perceivedTempEl.textContent = `Feels Like: ${currentConditions.feelslikeF} °F`;
    windSpeedEl.textContent = `Wind Speed: ${currentConditions.windspeedMph} mph`;
  }

  weatherConditionEl.textContent = `Condition: ${currentConditions.conditions}`;
  uvIndexEl.textContent = `UV Index: ${currentConditions.uvindex} ${userFriendlyUVIndex(currentConditions.uvindex)}`;
  aqiEl.textContent = `AQI: ${currentConditions.aqius} ${userFriendlyAQI(currentConditions.aqius)}`;
  humidityEl.textContent = `Humidity: ${currentConditions.humidity}%`;
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const location = inputEl.value.trim();
  if (location === "") {
    return;
  }

  try {
    const rawData = await fetchWeatherData(location);
    const weatherData = formatWeatherData(rawData);
    console.log(weatherData);
    renderWeatherData(weatherData);
  } catch (err) {
    console.log(err);
  }
});

function celciusToFahrenheit(c) {
  const f = c * (9 / 5) + 32;
  return Math.round(f * 10) / 10;
}

function kphToMph(kph) {
  const mph = kph * 0.621371;
  return Math.round(mph * 10) / 10;
}

function userFriendlyUVIndex(uvIndex) {
  if (uvIndex === null || uvIndex === undefined || isNaN(uvIndex)) {
    return "N/A";
  }

  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";

  return "Extreme";
}

function userFriendlyAQI(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return "N/A";
  }

  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";

  return "Hazardous";
}