export function userFriendlyUVIndex(uvIndex) {
  if (uvIndex === null || uvIndex === undefined || isNaN(uvIndex)) {
    return "N/A";
  }

  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";

  return "Extreme";
}

export function userFriendlyAQI(aqi) {
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