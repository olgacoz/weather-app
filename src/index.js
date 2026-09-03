import "./styles.css";

const API_KEY = "2LYJU4DK9EKDVFVNJ9ZNC9RYP";

const formEl = document.querySelector("form");
const inputEl = document.querySelector("input");

async function fetchWeatherData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&elements=add%3Aaqieur&key=${API_KEY}&contentType=json`,
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
      aqieur: data.currentConditions.aqieur,
      cloudcover: data.currentConditions.cloudcover,
      conditions: data.currentConditions.conditions,
      feelslike: data.currentConditions.feelslike,
      humidity: data.currentConditions.humidity,
      icon: data.currentConditions.icon,
      precip: data.currentConditions.precip,
      precipprob: data.currentConditions.precipprob,
      pressure: data.currentConditions.pressure,
      temp: data.currentConditions.temp,
      uvindex: data.currentConditions.uvindex,
      winddir: data.currentConditions.winddir,
      windspeed: data.currentConditions.windspeed,
    },
    days: data.days.map((day) => ({
      tempmax: day.tempmax,
      tempmin: day.tempmin,
    })),
  };
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
  } catch (err) {
    console.log(err);
  }
});

/* Data I want to get
Condition of Weather (e.g. Partially cloudy)
Weather Icon (e.g. partly-cloudy-day)
Current temp
Minimum temp
Maximum temp
Feels Like

Chance of rain
Rain amount
Wind speed and direction
UV index
AQI (EU)
Pressure
Humidity
Cloud Coverage
*/
