import "./styles.css";
import { fetchWeatherData } from "./modules/weatherApi.js";
import {
  userFriendlyUVIndex,
  userFriendlyAQI,
} from "./modules/weatherLevels.js";

let currentWeatherData = null;

const elements = {
  weatherCard: document.getElementById("weather-card"),
  errorMessage: document.getElementById("error-message"),
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
  elements.errorMessage.hidden = true;
  elements.weatherCard.hidden = false;

  const { currentConditions, resolvedAddress } = data;
  const isCelsius = elements.celsiusBtn.checked;

  elements.resolvedAddress.textContent = resolvedAddress;

  // Reset & load icon
  elements.iconContainer.replaceChildren();
  if (currentConditions.icon) {
    const iconUrl = await loadWeatherIcon(currentConditions.icon);
    if (iconUrl) {
      const img = document.createElement("img");
      img.id = "weather-icon";
      img.src = iconUrl;
      img.alt = currentConditions.conditions || "Weather condition icon";
      elements.iconContainer.appendChild(img);
    }
  }

  // Unit formatting
  const temp = isCelsius
    ? `${currentConditions.tempC} °C`
    : `${currentConditions.tempF} °F`;
  const feelsLike = isCelsius
    ? `${currentConditions.feelslikeC} °C`
    : `${currentConditions.feelslikeF} °F`;
  const wind = isCelsius
    ? `${currentConditions.windspeedKph} km/h`
    : `${currentConditions.windspeedMph} mph`;

  elements.currentTemp.textContent = `Temp: ${temp}`;
  elements.perceivedTemp.textContent = `Feels Like: ${feelsLike}`;
  elements.windSpeed.textContent = `Wind Speed: ${wind}`;

  elements.weatherCondition.textContent = `Condition: ${currentConditions.conditions}`;
  elements.uvIndex.textContent = `UV Index: ${currentConditions.uvindex} ${userFriendlyUVIndex(currentConditions.uvindex)}`;
  elements.aqi.textContent = `AQI: ${currentConditions.aqius} ${userFriendlyAQI(currentConditions.aqius)}`;
  elements.humidity.textContent = `Humidity: ${currentConditions.humidity}%`;
}

function renderLoading() {
  elements.errorMessage.hidden = true;
  elements.errorMessage.textContent = "";
  elements.weatherCard.hidden = false;
  elements.resolvedAddress.textContent = "Loading...";
  clearFields();
}

function renderError(message) {
  clearFields();
  elements.weatherCard.hidden = true;
  elements.errorMessage.hidden = false;
  elements.errorMessage.textContent = message;
}

function clearFields() {
  elements.iconContainer.replaceChildren();
  elements.currentTemp.textContent = "";
  elements.weatherCondition.textContent = "";
  elements.perceivedTemp.textContent = "";
  elements.windSpeed.textContent = "";
  elements.uvIndex.textContent = "";
  elements.aqi.textContent = "";
  elements.humidity.textContent = "";
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
