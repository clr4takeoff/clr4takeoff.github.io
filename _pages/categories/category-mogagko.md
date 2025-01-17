---
title: "Mogagko"
layout: archive
permalink: categories/mogagko
author_profile: true
sidebar_main: true
---

<h2 style="font-size: 1.5rem; margin-bottom: 10px;">Group Posts 👥</h2>
<div class="entries-group" style="background-color: #F3F3F3FF; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
  {% assign posts = site.categories.mogagko %}
  {% for post in posts %}
    {% if post.type == "team" %}
      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        {% include archive-single2.html type=page.entries_layout %}
      </div>
    {% endif %}
  {% endfor %}
</div>


<h2 style="font-size: 1.5rem; margin-bottom: 10px;">Individual Posts 👤</h2>
<div class="entries-individual" style="background-color: #E4F0F8FF; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
  {% assign posts = site.categories.mogagko %}
  {% for post in posts %}
    {% if post.type == "individual" %}
      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        {% include archive-single2.html type=page.entries_layout %}
      </div>
    {% endif %}
  {% endfor %}
</div>
