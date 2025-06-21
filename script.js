async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const apiKey = "5333cea061eb8d5da6403cfcfa3034e1";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
      throw new Error(data.message || "Failed to fetch forecast");
    }

    const forecastList = data.list;
    const dailyForecasts = {};

    forecastList.forEach(item => {
      if (item.dt_txt.includes("12:00:00")) {
        const date = item.dt_txt.split(" ")[0];
        dailyForecasts[date] = item;
      }
    });

    let html = `<h2>5-Day Forecast for ${data.city.name}</h2>`;
    html += `<div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">`;

        Object.keys(dailyForecasts).forEach(date => {
        const item = dailyForecasts[date];
        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;
        const readableDate = new Date(date).toDateString();

        html += `
            <div style="width: 160px; background:rgb(65, 155, 196); border-radius: 10px; padding: 12px; text-align: center;">
            <h4>${readableDate}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
            <p><strong>${temp}°C</strong></p>
            <p style="text-transform: capitalize;">${desc}</p>
            </div>
        `;
        });

        html += `</div>`;
    weatherDiv.innerHTML = html;

  } catch (error) {
    weatherDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}
