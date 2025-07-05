---
layout: category
title: "Daily"
category: daily
permalink: /categories/daily/
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.daily %}
{% for post in posts %} {% include archive-single2.html type=page.entries_layout %} {% endfor %}