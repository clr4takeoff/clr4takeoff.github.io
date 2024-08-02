(function(){
  'use strict';

  var _$Templater_7 = {
    compile: compile,
    setOptions: setOptions
  };

  const options = {};
  options.pattern = /\{(.*?)\}/g;
  options.template = '';
  options.middleware = function () {};

  function setOptions (_options) {
    options.pattern = _options.pattern || options.pattern;
    options.template = _options.template || options.template;
    if (typeof _options.middleware === 'function') {
      options.middleware = _options.middleware;
    }
  }

  function compile (data) {
    return options.template.replace(options.pattern, function (match, prop) {
      const value = options.middleware(prop, data[prop], options.template);
      if (typeof value !== 'undefined') {
        return value;
      }
      return data[prop] || match;
    });
  }

  'use strict';

  function fuzzysearch (needle, haystack) {
    var tlen = haystack.length;
    var qlen = needle.length;
    if (qlen > tlen) {
      return false;
    }
    if (qlen === tlen) {
      return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < qlen; i++) {
      var nch = needle.charCodeAt(i);
      while (j < tlen) {
        if (haystack.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  var _$fuzzysearch_1 = fuzzysearch;

  'use strict';

  var _$FuzzySearchStrategy_5 = new FuzzySearchStrategy();

  function FuzzySearchStrategy () {
    this.matches = function (string, crit) {
      return _$fuzzysearch_1(crit.toLowerCase(), string.toLowerCase());
    };
  }

  'use strict';

  var _$LiteralSearchStrategy_6 = new LiteralSearchStrategy();

  function LiteralSearchStrategy () {
    this.matches = function (str, crit) {
      if (!str) return false;

      str = str.trim().toLowerCase();
      crit = crit.trim().toLowerCase();

      return crit.split(' ').filter(function (word) {
        return str.indexOf(word) >= 0;
      }).length === crit.split(' ').length;
    };
  }

  'use strict';

  var _$Repository_4 = {
    put: put,
    clear: clear,
    search: search,
    setOptions: __setOptions_4
  };

  function NoSort () {
    return 0;
  }

  const data = [];
  let opt = {};

  opt.fuzzy = false;
  opt.limit = 10;
  opt.searchStrategy = _$LiteralSearchStrategy_6;
  opt.sort = NoSort;
  opt.exclude = [];

  function put (data) {
    if (isObject(data)) {
      return addObject(data);
    }
    if (isArray(data)) {
      return addArray(data);
    }
    return undefined;
  }

  function clear () {
    data.length = 0;
    return data;
  }

  function isObject (obj) {
    return Boolean(obj) && Object.prototype.toString.call(obj) === '[object Object]';
  }

  function isArray (obj) {
    return Boolean(obj) && Object.prototype.toString.call(obj) === '[object Array]';
  }

  function addObject (_data) {
    data.push(_data);
    return data;
  }

  function addArray (_data) {
    const added = [];
    clear();
    for (let i = 0, len = _data.length; i < len; i++) {
      if (isObject(_data[i])) {
        added.push(addObject(_data[i]));
      }
    }
    return added;
  }

  function search (crit) {
    if (!crit) {
      return [];
    }
    return findMatches(data, crit, opt.searchStrategy, opt).sort(opt.sort);
  }

  function __setOptions_4 (_opt) {
    opt = _opt || {};

    opt.fuzzy = _opt.fuzzy || false;
    opt.limit = _opt.limit || 10;
    opt.searchStrategy = _opt.fuzzy ? _$FuzzySearchStrategy_5 : _$LiteralSearchStrategy_6;
    opt.sort = _opt.sort || NoSort;
    opt.exclude = _opt.exclude || [];
  }

  function findMatches (data, crit, strategy, opt) {
    const matches = [];
    for (let i = 0; i < data.length && matches.length < opt.limit; i++) {
      const match = findMatchesInObject(data[i], crit, strategy, opt);
      if (match) {
        matches.push(match);
      }
    }
    return matches;
  }

  function findMatchesInObject (obj, crit, strategy, opt) {
    for (const key in obj) {
      if (!isExcluded(obj[key], opt.exclude) && strategy.matches(obj[key], crit)) {
        return obj;
      }
    }
  }

  function isExcluded (term, excludedTerms) {
    for (let i = 0, len = excludedTerms.length; i < len; i++) {
      const excludedTerm = excludedTerms[i];
      if (new RegExp(excludedTerm).test(term)) {
        return true;
      }
    }
    return false;
  }

  'use strict';

  var _$JSONLoader_2 = {
    load: load
  };

  function load (location, callback) {
    const xhr = getXHR();
    xhr.open('GET', location, true);
    xhr.onreadystatechange = createStateChangeListener(xhr, callback);
    xhr.send();
  }

  function createStateChangeListener (xhr, callback) {
    return function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          callback(null, JSON.parse(xhr.responseText));
        } catch (err) {
          callback(err, null);
        }
      }
    };
  }

  function getXHR () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  }

  'use strict';

  var _$OptionsValidator_3 = function OptionsValidator (params) {
    if (!validateParams(params)) {
      throw new Error('-- OptionsValidator: required options missing');
    }

    if (!(this instanceof OptionsValidator)) {
      return new OptionsValidator(params);
    }

    const requiredOptions = params.required;

    this.getRequiredOptions = function () {
      return requiredOptions;
    };

    this.validate = function (parameters) {
      const errors = [];
      requiredOptions.forEach(function (requiredOptionName) {
        if (typeof parameters[requiredOptionName] === 'undefined') {
          errors.push(requiredOptionName);
        }
      });
      return errors;
    };

    function validateParams (params) {
      if (!params) {
        return false;
      }
      return typeof params.required !== 'undefined' && params.required instanceof Array;
    }
  };

  'use strict';

  var _$utils_9 = {
    merge: merge,
    isJSON: isJSON
  };

  function merge (defaultParams, mergeParams) {
    const mergedOptions = {};
    for (const option in defaultParams) {
      mergedOptions[option] = defaultParams[option];
      if (typeof mergeParams[option] !== 'undefined') {
        mergedOptions[option] = mergeParams[option];
      }
    }
    return mergedOptions;
  }

  function isJSON (json) {
    try {
      if (json instanceof Object && JSON.parse(JSON.stringify(json))) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  var _$src_8 = {};
  (function (window) {
    'use strict';

    let options = {
      searchInput: null,
      resultsContainer: null,
      json: [],
      success: Function.prototype,
      searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
      templateMiddleware: Function.prototype,
      sortMiddleware: function () {
        return 0;
      },
      noResultsText: '그런 내용으로 쓴 글은 없는 듯?',
      limit: 10,
      fuzzy: false,
      debounceTime: null
    };

    let debounceTimerHandle;
    const debounce = function (func, delayMillis) {
      if (delay
