---
title: "CSAPP"
layout: archive
permalink: categories/csapp
author_profile: true
sidebar_main: true
---

<h2 style="font-size: 1.5rem; margin-bottom: 10px;">
DataLab 📊</h2>
<div class="entries-group" style="background-color: #F3F3F3FF; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
  {% assign posts = site.categories.csapp %}
  {% for post in posts %}
    {% if post.type == "datalab" %}
      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        {% include archive-single2.html type=page.entries_layout %}
      </div>
    {% endif %}
  {% endfor %}
</div>


<h2 style="font-size: 1.5rem; margin-bottom: 10px;">BombLab 💣</h2>
<div class="entries-individual" style="background-color: #F0F6FAFF; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
  {% assign posts = site.categories.csapp %}
  {% for post in posts %}
    {% if post.type == "bomblab" %}
      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        {% include archive-single2.html type=page.entries_layout %}
      </div>
    {% endif %}
  {% endfor %}
</div>

<h2 style="font-size: 1.5rem; margin-bottom: 10px;">ShellLab 🐢</h2>
<div class="entries-individual" style="background-color: #E4F0F8FF; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
  {% assign posts = site.categories.csapp %}
  {% for post in posts %}
    {% if post.type == "shelllab" %}
      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        {% include archive-single2.html type=page.entries_layout %}
      </div>
    {% endif %}
  {% endfor %}
</div>

<h2 style="font-size: 1.5rem; margin-bottom: 10px;">MallocLab 🔐</h2>
<div class="entries-individual" style="background-color: #BAD6E8FF; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
  {% assign posts = site.categories.csapp %}
  {% for post in posts %}
    {% if post.type == "malloclab" %}
      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        {% include archive-single2.html type=page.entries_layout %}
      </div>
    {% endif %}
  {% endfor %}
</div>