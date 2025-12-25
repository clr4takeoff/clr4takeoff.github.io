---
title: "Mogagko"
layout: archive
permalink: /categories/mogagko/
author_profile: true
sidebar_main: true

---

<h2 style="font-size: 1.5rem; margin-bottom: 15px;">모각코 시즌 선택</h2>

<div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
  <button class="season-button" onclick="showSeason('winter')">❄️ 2024 동계 모각코</button>
  <button class="season-button" onclick="showSeason('summer')">🌞 2025 하계 모각코</button>
  <button class="season-button" onclick="showSeason('winter2025')">⛄️ 2025 동계 모각코</button>
</div>

<!-- 2024 동계 모각코 영역 -->
<div id="season-winter" style="display: none;">
  <h2 style="font-size: 1.5rem;">2024 동계 모각코 ❄️</h2>

  <h3>Group Posts 👥</h3>
  <div class="entries-group" style="background-color: #F3F3F3; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
    {% assign posts = site.categories.mogagko | where_exp:"item", "item.season == 'winter-2024'" %}
    {% for post in posts %}
      {% if post.type == "team" %}
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd;">
          {% include archive-single2.html type=page.entries_layout %}
        </div>
      {% endif %}
    {% endfor %}
  </div>

  <h3>My Posts 👤</h3>
  <div class="entries-individual" style="background-color: #E4F0F8; padding: 15px; border-radius: 8px; margin-bottom: 50px;">
    {% assign posts = site.categories.mogagko | where_exp:"item", "item.season == 'winter-2024'" %}
    {% for post in posts %}
      {% if post.type == "individual" %}
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd;">
          {% include archive-single2.html type=page.entries_layout %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>

<!-- 2025 동계 모각코 영역 -->
<div id="season-winter2025" style="display: none;">
  <h2 style="font-size: 1.5rem;">2025 동계 모각코 ⛄️</h2>

  <!-- <h3>Group Posts 👥</h3>
  <div class="entries-group" style="background-color: #F3F3F3; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
    {% assign posts = site.categories.mogagko | where_exp:"item", "item.season == 'winter-2025'" %}
    {% for post in posts %}
      {% if post.type == "team" %}
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd;">
          {% include archive-single2.html type=page.entries_layout %}
        </div>
      {% endif %}
    {% endfor %}
  </div> -->

  <h3>My Posts 👤</h3>
  <div class="entries-individual" style="background-color: #E4F0F8; padding: 15px; border-radius: 8px; margin-bottom: 50px;">
    {% assign posts = site.categories.mogagko | where_exp:"item", "item.season == 'winter-2025'" %}
    {% for post in posts %}
      {% if post.type == "individual" %}
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd;">
          {% include archive-single2.html type=page.entries_layout %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>

<!-- 2025 하계 모각코 영역 -->
<div id="season-summer" style="display: none;">
  <h2 style="font-size: 1.5rem;">2025 하계 모각코 🌞</h2>

  <h3>Group Posts 👥</h3>
  <div class="entries-group" style="background-color: #F3F3F3; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
    {% assign posts = site.categories.mogagko | where_exp:"item", "item.season == 'summer-2025'" %}
    {% for post in posts %}
      {% if post.type == "team" %}
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd;">
          {% include archive-single2.html type=page.entries_layout %}
        </div>
      {% endif %}
    {% endfor %}
  </div>

  <h3>My Posts 👤</h3>
  <div class="entries-individual" style="background-color: #E4F0F8; padding: 15px; border-radius: 8px;">
    {% assign posts = site.categories.mogagko | where_exp:"item", "item.season == 'summer-2025'" %}
    {% for post in posts %}
      {% if post.type == "individual" %}
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd;">
          {% include archive-single2.html type=page.entries_layout %}
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>

<script>
function showSeason(season) {
  // 모든 시즌 섹션 숨기기
  const sections = ['season-winter', 'season-winter2025', 'season-summer'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // 선택된 시즌만 표시
  const targetId = (season === 'winter') ? 'season-winter'
                  : (season === 'winter2025') ? 'season-winter2025'
                  : 'season-summer';
  document.getElementById(targetId).style.display = 'block';

  // 버튼 강조
  const buttons = document.querySelectorAll('.season-button');
  buttons.forEach(btn => {
    const match = btn.getAttribute('onclick').match(/showSeason\(['"]([^'"]+)['"]\)/);
    if (match && match[1] === season) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // 기본값: 마지막 버튼(현재는 2025 하계) 자동 선택
  const buttons = document.querySelectorAll('.season-button');
  if (buttons.length > 0) {
    const lastButton = buttons[buttons.length - 1];
    const match = lastButton.getAttribute('onclick').match(/showSeason\(['"]([^'"]+)['"]\)/);
    if (match && match[1]) showSeason(match[1]);
  }
});
</script>

<style>
.season-button {
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.season-button.active {
  background-color: #4982C0FF;
  color: white;
  border-color: #4982C0FF;
}
</style>
