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
