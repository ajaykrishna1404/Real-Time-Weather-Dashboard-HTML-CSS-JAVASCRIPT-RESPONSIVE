const apiKey = '4ab4c9633b98d9f44f1d738a6fad3b00';
const weatherDiv = document.getElementById('weather');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  weatherDiv.innerHTML = `
    <h2>${name}</h2>
    <p><strong>Temperature:</strong> ${(main.temp - 273.15).toFixed(1)}°C</p>
    <p><strong>Weather:</strong> ${weather[0].description}</p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
  `;
}

function fetchWeatherByCity(city) {
  weatherDiv.innerHTML = "<p>Fetching weather...</p>";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => displayWeather(data))
    .catch(err => {
      weatherDiv.innerHTML = `<p style="color: red;">${err.message}</p>`;
    });
}

function fetchWeatherByLocation() {
  weatherDiv.innerHTML = "<p>Getting your location...</p>";
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
      .then(res => res.json())
      .then(data => displayWeather(data))
      .catch(err => {
        weatherDiv.innerHTML = `<p style="color: red;">Could not get weather data.</p>`;
      });
  }, () => {
    weatherDiv.innerHTML = "<p style='color: red;'>Location access denied.</p>";
  });
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

window.addEventListener('load', fetchWeatherByLocation);
