import "./styles.css";

const API_KEY = "2LYJU4DK9EKDVFVNJ9ZNC9RYP";

let currentWeatherData = null;

const formEl = document.querySelector("form");
const inputEl = document.getElementById("location-input");
const unitToggleEl = document.getElementById("unit-toggle");
const resolvedAddressEl = document.getElementById("resolved-address");
const currentTempEl = document.getElementById("current-temp");
const weatherConditionEl = document.getElementById("weather-condition");
const perceivedTempEl = document.getElementById("perceived-temp");
const windSpeedEl = document.getElementById("wind-speed");
const uvIndexEl = document.getElementById("uv-index");
const aqiEl = document.getElementById("aqi");
const humidityEl = document.getElementById("humidity");
const celsiusBtn = document.getElementById("celsius");
const searchBtn = document.getElementById("search-btn");

async function fetchWeatherData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&elements=add%3Aaqius&key=${API_KEY}&contentType=json`,
  );
  const weatherData = await response.json();
  return weatherData;
}

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
  if (celsiusBtn.checked) {
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
    searchBtn.disabled = true;
    renderLoading();

    const rawData = await fetchWeatherData(location);
    currentWeatherData = formatWeatherData(rawData);

    renderWeatherData(currentWeatherData);
  } catch (err) {
    console.log(err);
    currentWeatherData = null;

    resolvedAddressEl.classList.add('error');
    resolvedAddressEl.textContent = "Location not found or an error occurred.";
  } finally {
    searchBtn.disabled = false;
  }
});

unitToggleEl.addEventListener("change", () => {
  if (currentWeatherData) {
    renderWeatherData(currentWeatherData); // render the current weather data with the other unit user selected
  }
});

function renderLoading() {
  resolvedAddressEl.classList.remove('error'); // remove possible error class
  resolvedAddressEl.textContent = "Loading...";
  currentTempEl.textContent = "";
  weatherConditionEl.textContent = "";
  perceivedTempEl.textContent = "";
  windSpeedEl.textContent = "";
  uvIndexEl.textContent = "";
  aqiEl.textContent = "";
  humidityEl.textContent = "";
}

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
