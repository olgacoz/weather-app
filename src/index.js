import "./styles.css";
import { fetchWeatherData } from "./modules/weatherApi.js";
import {
  userFriendlyUVIndex,
  userFriendlyAQI,
} from "./modules/weatherLevels.js";

let currentWeatherData = null;

const elements = {
  weatherCard: document.getElementById("weather-card"),
  form: document.querySelector("form"),
  input: document.getElementById("location-input"),
  unitToggle: document.getElementById("unit-toggle"),
  resolvedAddress: document.getElementById("resolved-address"),
  iconContainer: document.getElementById("icon-container"),
  currentTemp: document.getElementById("current-temp"),
  weatherCondition: document.getElementById("weather-condition"),
  perceivedTemp: document.getElementById("perceived-temp"),
  windSpeed: document.getElementById("wind-speed"),
  uvIndex: document.getElementById("uv-index"),
  aqi: document.getElementById("aqi"),
  humidity: document.getElementById("humidity"),
  celsiusBtn: document.getElementById("celsius"),
  searchBtn: document.getElementById("search-btn"),
};

// Event Listeners
elements.form.addEventListener("submit", handleSearch);
elements.unitToggle.addEventListener("change", () => {
  if (currentWeatherData) renderWeatherData(currentWeatherData);
});

async function handleSearch(e) {
  e.preventDefault();

  const location = elements.input.value.trim();
  if (!location) return;

  try {
    elements.searchBtn.disabled = true;
    renderLoading();

    currentWeatherData = await fetchWeatherData(location);
    await renderWeatherData(currentWeatherData);
  } catch (err) {
    console.error(err);
    currentWeatherData = null;
    renderError("Location not found or an error occurred.");
  } finally {
    elements.searchBtn.disabled = false;
  }
}

async function renderWeatherData(data) {
  elements.weatherCard.classList.remove("is-loading", "has-error");
  elements.resolvedAddress.classList.remove("error");

  const { currentConditions, resolvedAddress } = data;
  const isCelsius = elements.celsiusBtn.checked;

  elements.resolvedAddress.textContent = resolvedAddress;

  const { temp, feelsLike, wind } = formatUnits(currentConditions, isCelsius);

  elements.currentTemp.textContent = `Temp: ${temp}`;
  elements.perceivedTemp.textContent = `Feels Like: ${feelsLike}`;
  elements.windSpeed.textContent = `Wind Speed: ${wind}`;
  elements.weatherCondition.textContent = `Condition: ${currentConditions.conditions}`;
  elements.uvIndex.textContent = `UV Index: ${currentConditions.uvindex} ${userFriendlyUVIndex(currentConditions.uvindex)}`;
  elements.aqi.textContent = `AQI: ${currentConditions.aqius} ${userFriendlyAQI(currentConditions.aqius)}`;
  elements.humidity.textContent = `Humidity: ${currentConditions.humidity}%`;

  await renderWeatherIcon(currentConditions.icon, currentConditions.conditions);
}

function renderLoading() {
  clearFields();
  elements.weatherCard.classList.add("is-loading");
  elements.weatherCard.classList.remove("has-error");
  elements.resolvedAddress.classList.remove("error");
  elements.resolvedAddress.textContent = "Loading...";
}

function renderError(message) {
  clearFields();
  elements.weatherCard.classList.remove("is-loading");
  elements.weatherCard.classList.add("has-error");
  elements.resolvedAddress.classList.add("error");
  elements.resolvedAddress.textContent = message;
}

function clearFields() {
  elements.iconContainer.replaceChildren();
  [
    elements.currentTemp,
    elements.weatherCondition,
    elements.perceivedTemp,
    elements.windSpeed,
    elements.uvIndex,
    elements.aqi,
    elements.humidity,
  ].forEach((el) => (el.textContent = ""));
}

function formatUnits(conditions, isCelsius) {
  if (isCelsius) {
    return {
      temp: `${conditions.tempC} °C`,
      feelsLike: `${conditions.feelslikeC} °C`,
      wind: `${conditions.windspeedKph} km/h`,
    };
  }

  return {
    temp: `${conditions.tempF} °F`,
    feelsLike: `${conditions.feelslikeF} °F`,
    wind: `${conditions.windspeedMph} mph`,
  };
}

async function renderWeatherIcon(iconName, altText) {
  elements.iconContainer.replaceChildren();
  if (!iconName) return;

  const iconUrl = await loadWeatherIcon(iconName);
  if (iconUrl) {
    const img = document.createElement("img");
    img.id = "weather-icon";
    img.src = iconUrl;
    img.alt = altText || "Weather condition icon";
    elements.iconContainer.appendChild(img);
  }
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
