import { celsiusToFahrenheit, kphToMph } from "./unitConversions.js";

const API_KEY = "2LYJU4DK9EKDVFVNJ9ZNC9RYP";

export async function fetchWeatherData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&elements=add%3Aaqius&key=${API_KEY}&contentType=json`
  );

  if (!response.ok) {
    throw new Error("Location not found");
  }

  const rawData = await response.json();
  return formatWeatherData(rawData);
}

function formatWeatherData(data) {
  const current = data.currentConditions;

  return {
    resolvedAddress: data.resolvedAddress,
    currentConditions: {
      aqius: current.aqius,
      conditions: current.conditions,
      feelslikeC: current.feelslike,
      feelslikeF: celsiusToFahrenheit(current.feelslike),
      humidity: current.humidity,
      icon: current.icon,
      tempC: current.temp,
      tempF: celsiusToFahrenheit(current.temp),
      uvindex: current.uvindex,
      windspeedKph: current.windspeed,
      windspeedMph: kphToMph(current.windspeed),
    },
  };
}