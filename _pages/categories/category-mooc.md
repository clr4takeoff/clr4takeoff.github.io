---
title: "Mooc"
layout: archive
permalink: categories/mooc
author_profile: true
sidebar_main: true
---


{% assign posts = site.categories.mooc%}
{% for post in posts %} {% include archive-single2.html type=page.entries_layout %} {% endfor %}