const map = L.map('map').setView([35.3315, 139.4033], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 外部JSONファイルからデータ読み込み
fetch('data.json')
  .then(res => res.json())
  .then(restaurants => {
    restaurants.forEach(spot => {
      L.marker([spot.lat, spot.lng])
        .addTo(map)
        .bindPopup(`<a href="${spot.url}" target="_blank">${spot.name}</a>`)
        .openPopup();
    });

    // 🔴 自宅の赤ピンを追加
    const myHome = {
      lat: 35.325965494228086,  // ← あなたの自宅の緯度に変更してください
      lng: 139.4037473836777, // ← あなたの自宅の経度に変更してください
      label: "🏠 自宅"
    };

const redIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35]
});

L.marker([myHome.lat, myHome.lng], { icon: redIcon })
  .addTo(map)
  .bindPopup(myHome.label)
  .openPopup();
  });