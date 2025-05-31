const map = L.map('map').setView([35.3315, 139.4033], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 外部JSONファイルからデータ読み込み
fetch('data.json')
  .then(res => res.json())
  .then(restaurants => {
    restaurants.forEach(spot => {
      const marker = L.marker([spot.lat, spot.lng]).addTo(map);
      const popup = L.popup({ autoClose: false, closeOnClick: false })
        .setContent(`<a href="${spot.url}" target="_blank">${spot.name}</a>`);
      marker.bindPopup(popup).openPopup(); // ← すべて開く
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
    homeMarker.bindPopup(homePopup).openPopup(); // ← 自宅も開いたまま
  });