document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "E2dX6fLUGsszhOWT3zO2FzxrD54DB88l"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyWeatherData(locationKey);
                    fetchDailyForecast(locationKey); // Fetch 10-day forecast as well
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching current weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function fetchHourlyWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyWeather(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly weather data:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly weather data.</p>`;
            });
    }

    function displayHourlyWeather(data) {
        let hourlyWeatherContent = `<h2>Hourly Weather Forecast</h2>`;
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString();
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;

            hourlyWeatherContent += `
                <div>
                    <p>Time: ${time}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });

        weatherDiv.innerHTML += hourlyWeatherContent;
    }

    function fetchDailyForecast(locationKey) {
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                displayDailyForecast(data.DailyForecasts);
            } else {
                weatherDiv.innerHTML += `<p>No 5-day forecast available.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching daily forecast:", error);
            weatherDiv.innerHTML += `<p>Error fetching daily forecast.</p>`;
        });
}

    function displayDailyForecast(forecasts) {
        let dailyForecastContent = `<h2>5-Day Weather Forecast</h2>`;
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const maxTemp = forecast.Temperature.Maximum.Value;
            const minTemp = forecast.Temperature.Minimum.Value;
            const weather = forecast.Day.IconPhrase;

            dailyForecastContent += `
                <div>
                    <p>Date: ${date.toDateString()}</p>
                    <p>Max Temperature: ${maxTemp}°C</p>
                    <p>Min Temperature: ${minTemp}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });

        weatherDiv.innerHTML += dailyForecastContent;
    }
});
