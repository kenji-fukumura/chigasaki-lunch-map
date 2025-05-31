function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Chigasaki,jp&units=metric&lang=ja&appid=${API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].description;
      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

      const weatherText = `<img src="${iconUrl}" alt="${weather}" /> ${weather} ${temp}℃`;
      const weatherDiv = document.getElementById("weather-info");
      const toggleBtn = document.getElementById("weather-toggle");

      if (weatherDiv) {
        weatherDiv.innerHTML = weatherText;

        // 🌤 背景色を天気によって変更
        const bgMap = [
          { keyword: "晴", color: "rgba(255, 236, 200, 0.9)" }, // 薄オレンジ
          { keyword: "曇", color: "rgba(200, 220, 240, 0.9)" }, // ブルーグレー
          { keyword: "雨", color: "rgba(180, 200, 230, 0.9)" }, // 薄水色
          { keyword: "雪", color: "rgba(240, 240, 255, 0.9)" }, // 白っぽい
          { keyword: "雷", color: "rgba(255, 230, 180, 0.9)" }, // 黄っぽい
        ];
        const matched = bgMap.find(entry => weather.includes(entry.keyword));
        weatherDiv.style.background = matched
          ? matched.color
          : "rgba(245, 245, 245, 0.9)";
      }

      if (toggleBtn) {
        toggleBtn.innerHTML = `<img src="${iconUrl}" alt="${weather}" style="height:16px;width:16px;vertical-align:middle;margin-right:6px;"> 現在の天気`;
      }
    })
    .catch(err => {
      console.error("天気取得失敗:", err);
      const weatherDiv = document.getElementById("weather-info");
      const toggleBtn = document.getElementById("weather-toggle");

      if (weatherDiv) {
        weatherDiv.textContent = "天気取得に失敗しました";
        weatherDiv.style.background = "rgba(255, 220, 220, 0.9)"; // エラー用の背景色
      }
      if (toggleBtn) {
        toggleBtn.textContent = "現在の天気（取得失敗）";
      }
    });
}