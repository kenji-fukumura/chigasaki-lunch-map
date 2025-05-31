const map = L.map('map').setView([35.3315, 139.4033], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// グローバル変数
let restaurantMarkers = [];
let homeMarker;

// 今日の曜日を取得
const getToday = () => {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[new Date().getDay()];
};

// 地図にピンを表示する関数
function renderMarkers(restaurants, selectedDay) {
  // 一度削除（重複しないよう）
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
    // 初期状態で今日の曜日を使う
    const today = getToday();
    document.getElementById('weekday').value = today;
    renderMarkers(restaurants, today);

    // 自宅ピンは1回だけ表示
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

    // セレクトボックスの変更時に営業判定を再描画
    document.getElementById('weekday').addEventListener('change', (e) => {
      const selectedDay = e.target.value;
      renderMarkers(restaurants, selectedDay);
    });
  });