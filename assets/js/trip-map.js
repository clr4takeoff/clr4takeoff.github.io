(function () {
  if (!window.L || !window.TRIP_POSTS || !window.LOCATIONS) return;

  const map = L.map("trip-map", {
    scrollWheelZoom: false,
    worldCopyJump: true
  }).setView([20, 0], 2);

  // 세계 범위로 이동 제한 (가로 무한 반복 방지)
  const southWest = L.latLng(-85, -250);
  const northEast = L.latLng(85, 250);
  const maxBounds = L.latLngBounds(southWest, northEast);

  map.setMaxBounds(maxBounds);
  map.on("drag", () => map.panInsideBounds(maxBounds, { animate: false }));

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m]));
  }

  // loc별로 글 묶기
  const byLoc = new Map();
  for (const p of window.TRIP_POSTS) {
    const loc = (p.loc || "").toUpperCase();
    if (!loc || !window.LOCATIONS[loc]) continue;
    if (!byLoc.has(loc)) byLoc.set(loc, []);
    byLoc.get(loc).push(p);
  }

  const bounds = [];

  // 마커 생성
  for (const [loc, posts] of byLoc.entries()) {
    const info = window.LOCATIONS[loc];
    const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

    const marker = L.marker([info.lat, info.lng]).addTo(map);
    bounds.push([info.lat, info.lng]);

    marker.bindPopup(
      `
      <div class="trip-popup">
        <div class="trip-popup__title">
          ${escapeHtml(info.name)}
          <span class="trip-popup__count">(${sorted.length})</span>
        </div>

        <div class="trip-popup__list">
          ${sorted
            .map(
              (p) => `
              <div class="trip-popup__item">
                <a class="trip-popup__link" href="${p.url}">${escapeHtml(p.title)}</a>
                <span class="trip-popup__date">${p.date}</span>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
      `,
      {
        maxWidth: 360,
        autoPanPadding: [24, 24],
        closeButton: true
      }
    );

    // --- 여기부터: hover 시 열리되, 팝업 위로 이동하면 닫히지 않게 처리 ---
    let isOverPopup = false;

    marker.on("popupopen", (e) => {
      const popupEl = e.popup.getElement();
      if (!popupEl) return;

      // 팝업 위에 있으면 닫지 않도록 상태 유지
      popupEl.addEventListener("mouseenter", () => {
        isOverPopup = true;
      });

      popupEl.addEventListener("mouseleave", () => {
        isOverPopup = false;
        marker.closePopup();
      });
    });

    marker.on("mouseover", () => marker.openPopup());

    marker.on("mouseout", () => {
      // 마커 -> 팝업으로 커서 이동하는 찰나를 흡수
      setTimeout(() => {
        if (!isOverPopup) marker.closePopup();
      }, 50);
    });

    marker.on("click", () => marker.openPopup());
    // --- 여기까지 ---
  }

  // 마커들이 화면에 다 보이도록 자동 줌 (마커 2개 이상일 때만)
  if (bounds.length >= 2) {
    map.fitBounds(bounds, { padding: [30, 30] });
  } else if (bounds.length === 1) {
    map.setView(bounds[0], 6);
  }
})();
