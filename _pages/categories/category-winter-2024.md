---
title: "2024-2025 동계 모각코"
layout: archive
permalink: /categories/winter-2024/
author_profile: true
sidebar_main: true
---

<h2>동계 모각코 Group Posts 👥</h2>
<div class="entries-group">
  {% assign posts = site.categories.winter-2024 %}
  {% for post in posts %}
    {% if post.type == "team" %}
      <div>{% include archive-single2.html type=page.entries_layout %}</div>
    {% endif %}
  {% endfor %}
</div>

<h2>동계 모각코 My Posts 👤</h2>
<div class="entries-individual">
  {% assign posts = site.categories.winter-2024 %}
  {% for post in posts %}
    {% if post.type == "individual" %}
      <div>{% include archive-single2.html type=page.entries_layout %}</div>
    {% endif %}
  {% endfor %}
</div>
