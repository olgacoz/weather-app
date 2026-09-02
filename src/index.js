import "./styles.css";

const API_KEY = "2LYJU4DK9EKDVFVNJ9ZNC9RYP";

async function fetchWeatherData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`,
    );
    const weatherData = await response.json();
    console.log(weatherData);
  } catch (err) {
    console.log(err);
  }
}

fetchWeatherData("Kyrenia");

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