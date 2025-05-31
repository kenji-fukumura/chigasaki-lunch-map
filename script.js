
const map = L.map('map').setView([35.3315, 139.4033], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let restaurantMarkers = [];
let homeMarker;

const getToday = () => {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[new Date().getDay()];
};

const API_KEY = "64a9f612a58030710d4281a20aa785da";

// 天気取得と表示
function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Chigasaki,jp&units=metric&lang=ja&appid=${API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].description;
      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

      // 詳細表示部分
      const weatherText = `<img src="${iconUrl}" alt="${weather}" /> ${weather} ${temp}℃`;
      const weatherDiv = document.getElementById("weather-info");
      if (weatherDiv) {
        weatherDiv.innerHTML = weatherText;
      }

      // トグルボタン部分（文言固定、アイコンだけ更新）
      const toggleBtn = document.getElementById("weather-toggle");
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
      }
      if (toggleBtn) {
        toggleBtn.textContent = "現在の天気（取得失敗）";
      }
    });
}

// 初期実行
fetchWeather();

function renderMarkers(restaurants, selectedDay) {
  restaurantMarkers.forEach(marker => map.removeLayer(marker));
  restaurantMarkers = [];

  restaurants.forEach(spot => {
    const isClosedToday =
      Array.isArray(spot.closed) &&
      spot.closed.some(day => day.trim() === selectedDay);
    const statusText = isClosedToday ? "❌ 定休日" : "✅ 営業日";

    const marker = L.marker([spot.lat, spot.lng]).addTo(map);
    const popup = L.popup({ autoClose: false, closeOnClick: false })
      .setContent(`
        <a href="${spot.url}" target="_blank"><strong>${spot.name}</strong></a><br/>
        ${statusText}
      `);
    marker.bindPopup(popup).openPopup();

    restaurantMarkers.push(marker);
  });
}

fetch('data.json')
  .then(res => res.json())
  .then(restaurants => {
    const today = getToday();
    document.getElementById('weekday').value = today;
    renderMarkers(restaurants, today);

    const myHome = {
      lat: 35.325965494228086,
      lng: 139.4037473836777,
      label: "🏠 自宅"
    };

    const redIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -35]
    });

    homeMarker = L.marker([myHome.lat, myHome.lng], { icon: redIcon }).addTo(map);
    const homePopup = L.popup({ autoClose: false, closeOnClick: false }).setContent(myHome.label);
    homeMarker.bindPopup(homePopup).openPopup();

    document.getElementById('weekday').addEventListener('change', (e) => {
      const selectedDay = e.target.value;
      renderMarkers(restaurants, selectedDay);
    });
  });

// トグル処理（詳細表示）
const toggleBtn = document.getElementById("weather-toggle");
const weatherInfo = document.getElementById("weather-info");

if (toggleBtn && weatherInfo) {
  toggleBtn.addEventListener("click", () => {
    const visible = weatherInfo.style.display !== "none";
    weatherInfo.style.display = visible ? "none" : "flex";
  });
}