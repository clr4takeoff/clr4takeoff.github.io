---
title: "Recap"
layout: archive
permalink: /categories/recap/
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.recap %}
{% for post in posts %} {% include archive-single2.html type=page.entries_layout %} {% endfor %}
