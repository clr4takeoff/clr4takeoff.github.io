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
  // 전체 글 중 trip_location 있는 글만 뽑기 (카테고리 무관)
  {% assign geo_posts = site.posts | where_exp: "p", "p.trip_location" %}

  window.TRIP_POSTS = [
    {% for p in geo_posts %}
      {
        title: {{ p.title | jsonify }},
        url: {{ p.url | relative_url | jsonify }},
        date: {{ p.date | date: "%Y-%m-%d" | jsonify }},
        loc: {{ p.trip_location | upcase | jsonify }},
        categories: {{ p.categories | jsonify }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  // 위치 데이터: _data/trip_locations.yml
  window.LOCATIONS = {{ site.data.trip_locations | jsonify }};
</script>


<script src="{{ '/assets/js/trip-map.js' | relative_url }}"></script>