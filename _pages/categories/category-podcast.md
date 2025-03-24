---
title: "Podcasts"
layout: podcast
permalink: categories/podcasts
podcast_grid: true
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.podcasts %}
{% for post in posts %} {% include podcast-single.html %} {% endfor %}