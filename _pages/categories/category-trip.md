---
layout: single
title: "Trip (2025~)"
permalink: /categories/trip/
author_profile: true
sidebar_main: true
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div id="trip-map" style="height: 700px; width: 1000px;"></div>

<script>
  // trip 카테고리 글 중 trip_location 있는 글만 뽑기
  window.TRIP_POSTS = [
    {% assign trips = site.categories.trip %}
    {% for p in trips %}
      {% if p.trip_location %}
      {
        title: {{ p.title | jsonify }},
        url: {{ p.url | relative_url | jsonify }},
        date: {{ p.date | date: "%Y-%m-%d" | jsonify }},
        loc: {{ p.trip_location | upcase | jsonify }}
      }{% unless forloop.last %},{% endunless %}
      {% endif %}
    {% endfor %}
  ];

  // 위치 데이터: _data/trip_locations.yml
  window.LOCATIONS = {{ site.data.trip_locations | jsonify }};
</script>


<script src="{{ '/assets/js/trip-map.js' | relative_url }}"></script>
