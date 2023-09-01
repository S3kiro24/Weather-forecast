const apiKey = '6d44069804ee70f72e46aef6bf6d6700';
const baseUrl = 'https://api.openweathermap.org/data/2.5';

const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const searchHistory = document.getElementById('search-history');

// Load search history from local storage
const savedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
savedSearchHistory.forEach(city => addToSearchHistory(city));

cityForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();

  if (cityName) {
    getWeather(cityName);
  }
});

function getWeather(cityName) {
  fetch(`${baseUrl}/weather?q=${cityName}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      addToSearchHistory(cityName);
    })
    .catch(error => console.error('Error fetching weather:', error));
}

function displayCurrentWeather(data) {
  currentWeatherSection.innerHTML = '';

  const city = data.name;
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const icon = data.weather[0].icon;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const currentWeatherHTML = `
    <h2>${city} (${date}) <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${data.weather[0].description}"></h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  currentWeatherSection.innerHTML = currentWeatherHTML;
}

function addToSearchHistory(cityName) {
  // Check if the city is already in the search history
  const isDuplicate = Array.from(searchHistory.children).some(item => item.textContent === cityName);

  if (!isDuplicate) {
    const historyItem = document.createElement('button');
    historyItem.textContent = cityName;
    historyItem.addEventListener('click', () => getWeather(cityName));
    searchHistory.appendChild(historyItem);

    // Limit the number of history items to a reasonable amount
    if (searchHistory.children.length > 10) {
      searchHistory.removeChild(searchHistory.children[0]);
    }
  }
}