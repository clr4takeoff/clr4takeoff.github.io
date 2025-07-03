---
title: "2025 하계 모각코"
layout: archive
permalink: /categories/2025-summer-mogagko/
author_profile: true
sidebar_main: true
---
<h2>My Posts 👤</h2>
<div class="entries-individual">
  {% assign posts = site.categories.summer-2025 %}
  {% for post in posts %}
    {% if post.type == "individual" %}
      <div>{% include archive-single2.html type=page.entries_layout %}</div>
    {% endif %}
  {% endfor %}
</div>
