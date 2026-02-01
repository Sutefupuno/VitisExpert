
export interface AutoWeatherData {
  region: string;
  tempTrend: string;
  frostRisk: string;
  precipitation: string;
  windSpeed: string;
}

/**
 * Fetches location name and weather forecast to derive pruning relevant data.
 */
export const fetchWeatherForPruning = async (): Promise<AutoWeatherData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation wird von diesem Browser nicht unterstützt."));
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        // 1. Get Region Name (Reverse Geocoding)
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const geoData = await geoResponse.json();
        const region = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || "Unbekannt";

        // 2. Get Weather Data (Open-Meteo)
        // Added precipitation_sum and wind_speed_10m_max
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const maxTemps = weatherData.daily.temperature_2m_max;
        const minTemps = weatherData.daily.temperature_2m_min;
        const precipSums = weatherData.daily.precipitation_sum;
        const windSpeeds = weatherData.daily.wind_speed_10m_max;

        // Calculate Temperature Trend
        let tempTrend = "Stabil (mild)";
        const currentMax = maxTemps[0];
        const futureMax = maxTemps[3]; // Look 3 days ahead

        if (futureMax > currentMax + 2) {
          tempTrend = "Ansteigend";
        } else if (futureMax < currentMax - 2) {
          tempTrend = "Sinkend";
        } else if (currentMax < 5) {
          tempTrend = "Stabil (frostig)";
        }

        // Calculate Frost Risk (Look at next 7 days)
        let frostRisk = "Gering";
        const absoluteMin = Math.min(...minTemps);

        if (absoluteMin < -2) {
          frostRisk = "Hoch (Spätfrostgefahr)";
        } else if (absoluteMin < 2) {
          frostRisk = "Mittel";
        }

        // Current weather conditions (Day 0)
        const precipitation = `${precipSums[0]} mm`;
        const windSpeed = `${windSpeeds[0]} km/h`;

        resolve({
          region,
          tempTrend,
          frostRisk,
          precipitation,
          windSpeed
        });
      } catch (err) {
        reject(new Error("Fehler beim Abrufen der Wetterdaten."));
      }
    }, (err) => {
      reject(new Error("Standortzugriff verweigert oder nicht verfügbar."));
    });
  });
};
