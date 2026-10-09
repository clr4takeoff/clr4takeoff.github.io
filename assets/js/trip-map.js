(function () {
  if (!window.L || !window.TRIP_POSTS || !window.LOCATIONS) return;

  const map = L.map("trip-map", {
    scrollWheelZoom: false,
    worldCopyJump: true,
    minZoom: 2
  }).setView([20, 0], 2);

  // 세계 범위로 이동 제한 (가로 무한 반복 방지)
  const southWest = L.latLng(-85, -250);
  const northEast = L.latLng(85, 250);
  const maxBounds = L.latLngBounds(southWest, northEast);

  map.setMaxBounds(maxBounds);
  window.addEventListener("load", () => map.invalidateSize());
  window.addEventListener("resize", () => map.invalidateSize());
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

  const PAGE_SIZE = 5;

  function buildPopupContent(locName, sorted, page, cc) {
    const total = sorted.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const pagePosts = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const nav = total > PAGE_SIZE ? `
      <div class="trip-popup__pagination">
        <button class="trip-popup__nav" data-dir="-1" ${page === 0 ? "disabled" : ""}>&#8249;</button>
        <span class="trip-popup__page">${page + 1} / ${totalPages}</span>
        <button class="trip-popup__nav" data-dir="1" ${page >= totalPages - 1 ? "disabled" : ""}>&#8250;</button>
      </div>
    ` : "";

    return `
      <div class="trip-popup">
        <div class="trip-popup__title">
          <span class="iconify trip-popup__flag" data-icon="circle-flags:${cc}"></span>${escapeHtml(locName)}
          <span class="trip-popup__count">(${total})</span>
        </div>
        <div class="trip-popup__list">
          ${pagePosts.map((p) => `
            <div class="trip-popup__item">
              <a class="trip-popup__link" href="${p.url}">${escapeHtml(p.title)}</a>
              <span class="trip-popup__date">${p.date.slice(0, 10)}</span>
            </div>
          `).join("")}
        </div>
        ${nav}
      </div>
    `;
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
  const pinsEl = document.getElementById("trip-pins");

  // 마커 생성
  for (const [loc, posts] of byLoc.entries()) {
    const info = window.LOCATIONS[loc];
    const cc = loc.split("-")[0].toLowerCase();
    const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

    const marker = L.marker([info.lat, info.lng]).addTo(map);
    bounds.push([info.lat, info.lng]);

    let currentPage = 0;
    let isOverPopup = false;
    let isNavigating = false;
    let navTimer = null;

    const popup = L.popup({
      minWidth: 300,
      maxWidth: 420,
      autoPanPadding: [24, 24],
      closeButton: true,
      className: "trip-popup-wrapper"
    }).setContent(buildPopupContent(info.name, sorted, currentPage, cc));

    marker.bindPopup(popup);

    marker.on("popupopen", (e) => {
      const popupEl = e.popup.getElement();
      if (!popupEl) return;

      if (popupEl._tripListenersAdded) return;
      popupEl._tripListenersAdded = true;

      popupEl.addEventListener("mouseenter", () => {
        isOverPopup = true;
      });

      popupEl.addEventListener("mouseleave", () => {
        // 화살표 클릭 직후 크기 변화로 인한 spurious mouseleave 차단
        if (isNavigating) return;
        isOverPopup = false;
        marker.closePopup();
      });

      popupEl.addEventListener("click", (evt) => {
        const btn = evt.target.closest(".trip-popup__nav");
        if (!btn || btn.disabled) return;

        evt.stopPropagation();
        isNavigating = true;
        clearTimeout(navTimer);

        const dir = parseInt(btn.dataset.dir, 10);
        const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
        currentPage = Math.max(0, Math.min(totalPages - 1, currentPage + dir));
        popup.setContent(buildPopupContent(info.name, sorted, currentPage, cc));

        // 팝업 크기 재계산 후 마우스가 실제로 나갔는지 확인
        navTimer = setTimeout(() => {
          isNavigating = false;
          if (!popupEl.matches(":hover")) {
            isOverPopup = false;
            marker.closePopup();
          }
        }, 200);
      });
    });

    marker.on("popupclose", () => {
      isNavigating = false;
      clearTimeout(navTimer);
    });

    marker.on("mouseover", () => {
      currentPage = 0;
      popup.setContent(buildPopupContent(info.name, sorted, currentPage, cc));
      marker.openPopup();
    });

    marker.on("mouseout", () => {
      setTimeout(() => {
        if (!isOverPopup) marker.closePopup();
      }, 50);
    });

    marker.on("click", () => marker.openPopup());

    if (pinsEl) {
      let group = pinsEl.querySelector(`[data-cc="${cc}"]`);
      if (!group) {
        group = document.createElement("div");
        group.className = "trip-pins__group";
        group.dataset.cc = cc;
        group.innerHTML = `<span class="iconify trip-pins__flag" data-icon="circle-flags:${cc}"></span>`;
        pinsEl.appendChild(group);
      }
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "trip-pins__item";
      chip.innerHTML = `${escapeHtml(info.name)} <span class="trip-pins__count">${sorted.length}</span>`;
      chip.addEventListener("click", () => {
        document.getElementById("trip-map").scrollIntoView({ behavior: "smooth", block: "center" });
        map.flyTo([info.lat, info.lng], Math.max(map.getZoom(), 6));
        map.once("moveend", () => marker.openPopup());
      });
      group.appendChild(chip);
    }
  }

  if (bounds.length >= 2) {
    map.fitBounds(bounds, { padding: [30, 30] });
  } else if (bounds.length === 1) {
    map.setView(bounds[0], 6);
  }
})();
