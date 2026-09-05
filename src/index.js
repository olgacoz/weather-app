import "./styles.css";
import { celsiusToFahrenheit, kphToMph } from "./modules/unitConversions.js";
import {
  userFriendlyUVIndex,
  userFriendlyAQI,
} from "./modules/weatherLevels.js";

const API_KEY = "2LYJU4DK9EKDVFVNJ9ZNC9RYP";
let currentWeatherData = null;

const formEl = document.querySelector("form");
const inputEl = document.getElementById("location-input");
const unitToggleEl = document.getElementById("unit-toggle");
const resolvedAddressEl = document.getElementById("resolved-address");
const iconContainerEl = document.getElementById("icon-container");
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

  if (!response.ok) {
    throw new Error("Location not found");
  }

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
      feelslikeF: celsiusToFahrenheit(data.currentConditions.feelslike),
      humidity: data.currentConditions.humidity,
      icon: data.currentConditions.icon,
      tempC: data.currentConditions.temp,
      tempF: celsiusToFahrenheit(data.currentConditions.temp),
      uvindex: data.currentConditions.uvindex,
      windspeedKph: data.currentConditions.windspeed,
      windspeedMph: kphToMph(data.currentConditions.windspeed),
    },
  };
}

async function renderWeatherData(data) {
  const { currentConditions, resolvedAddress } = data;

  resolvedAddressEl.textContent = resolvedAddress;

  // İkonu dinamik olarak container içine ekleme
  iconContainerEl.innerHTML = "";
  if (currentConditions.icon) {
    const iconUrl = await loadWeatherIcon(currentConditions.icon);
    if (iconUrl) {
      const img = document.createElement("img");
      img.id = "weather-icon";
      img.src = iconUrl;
      img.alt = currentConditions.conditions || "Weather condition icon";
      iconContainerEl.appendChild(img);
    }
  }

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

    await renderWeatherData(currentWeatherData);
  } catch (err) {
    console.log(err);
    currentWeatherData = null;

    iconContainerEl.innerHTML = "";
    resolvedAddressEl.classList.add("error");
    resolvedAddressEl.textContent = "Location not found or an error occurred.";
  } finally {
    searchBtn.disabled = false;
  }
});

unitToggleEl.addEventListener("change", () => {
  if (currentWeatherData) {
    renderWeatherData(currentWeatherData);
  }
});

function renderLoading() {
  resolvedAddressEl.classList.remove("error");
  resolvedAddressEl.textContent = "Loading...";
  iconContainerEl.innerHTML = "";
  currentTempEl.textContent = "";
  weatherConditionEl.textContent = "";
  perceivedTempEl.textContent = "";
  windSpeedEl.textContent = "";
  uvIndexEl.textContent = "";
  aqiEl.textContent = "";
  humidityEl.textContent = "";
}

async function loadWeatherIcon(iconName) {
  try {
    const iconModule = await import(
      `./assets/icons/weather-icons/${iconName}.svg`
    );
    return iconModule.default;
  } catch (err) {
    console.warn(`Icon '${iconName}' not found.`, err);
    return null;
  }
}