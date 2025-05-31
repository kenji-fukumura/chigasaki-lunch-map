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
        .bindPopup(`<a href="${spot.url}" target="_blank">${spot.name}</a>`);
    });
  });