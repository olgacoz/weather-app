import "./styles.css";

const API_KEY = "2LYJU4DK9EKDVFVNJ9ZNC9RYP";

async function fetchWeatherData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&elements=add%3Aaqieur&key=${API_KEY}&contentType=json`
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
