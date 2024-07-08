---
author_profile: true
layout: search
page_title: Search
permalink: /search/
---

## Search 🔎

<!-- Script pointing to jekyll-search.js -->
<script src="/assets/js/simple-jekyll-search.js" type="text/javascript"></script>

<script type="text/javascript">
SimpleJekyllSearch({
     searchInput: document.getElementById('search-input'),
     resultsContainer: document.getElementById('results-container'),
     json: 'assets/json/search.json',
     searchResultTemplate: '<li><a href="{url}" title="{desc}" target="_blank">{title}</a></li>',
     noResultsText: '검색결과가 존재하지 않습니다.',
     limit: 10000,
     fuzzy: false,
     exclude: ['Welcome']
});
</script>

<style>
  #search-bar {
    display: flex;
    align-items: center;
  }

  #search-bar i {
    margin-right: 10px;
  }

  #search-input {
    flex: 1;
  }

  .highlight {
    background-color: yellow;
  }
</style>
