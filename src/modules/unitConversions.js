export function celsiusToFahrenheit(c) {
  const f = c * (9 / 5) + 32;
  return Math.round(f * 10) / 10;
}

export function kphToMph(kph) {
  const mph = kph * 0.621371;
  return Math.round(mph * 10) / 10;
}