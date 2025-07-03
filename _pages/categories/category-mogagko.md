---
title: "Mogagko"
layout: archive
permalink: /categories/mogagko/
author_profile: true
sidebar_main: true
---

<h2 style="font-size: 1.5rem; margin-bottom: 15px;">모각코 시즌 선택</h2>

<div style="display: flex; gap: 10px; margin-bottom: 20px;">
  <button onclick="showSeason('winter')" style="padding: 10px 15px; border-radius: 5px; border: 1px solid #ccc;">❄️ 2024-2025 동계 모각코</button>
  <button onclick="showSeason('summer')" style="padding: 10px 15px; border-radius: 5px; border: 1px solid #ccc;">🌞 2025 하계 모각코</button>
</div>

<!-- 동계 모각코 영역 -->
<div id="season-winter" style="display: none;">
  <h2 style="font-size: 1.5rem;">2024-2025 동계 모각코 ❄️</h2>

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

<!-- 하계 모각코 영역 -->
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
  document.getElementById('season-winter').style.display = (season === 'winter') ? 'block' : 'none';
  document.getElementById('season-summer').style.display = (season === 'summer') ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('button[onclick^="showSeason"]');
  if (buttons.length > 0) {
    const lastButton = buttons[buttons.length - 1];
    const match = lastButton.getAttribute('onclick').match(/showSeason\(['"]([^'"]+)['"]\)/);
    if (match && match[1]) {
      showSeason(match[1]);
    }
  }
});
</script>


