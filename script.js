const map = L.map('map').setView([35.3315, 139.4033], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 今日の曜日を取得（"日"〜"土"）
const getToday = () => {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[new Date().getDay()];
};

// 外部JSONファイルからデータ読み込み
fetch('data.json')
  .then(res => res.json())
  .then(restaurants => {
    const today = getToday();

    restaurants.forEach(spot => {
      // 定休日判定（安全に配列かつトリム）
      const isClosedToday =
        Array.isArray(spot.closed) &&
        spot.closed.map(day => day.trim()).includes(today);
      const statusText = isClosedToday ? "❌ 定休日" : "✅ 営業中";

      const marker = L.marker([spot.lat, spot.lng]).addTo(map);
      const popup = L.popup({ autoClose: false, closeOnClick: false })
        .setContent(`
          <a href="${spot.url}" target="_blank"><strong>${spot.name}</strong></a><br/>
          ${statusText}
        `);
      marker.bindPopup(popup).openPopup();
    });

    // 🔴 自宅の赤ピンを追加
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

    const homeMarker = L.marker([myHome.lat, myHome.lng], { icon: redIcon }).addTo(map);
    const homePopup = L.popup({ autoClose: false, closeOnClick: false })
      .setContent(myHome.label);
    homeMarker.bindPopup(homePopup).openPopup();
  });