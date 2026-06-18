document.addEventListener('DOMContentLoaded', function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var searchForms = document.querySelectorAll('[data-site-search-form]');
  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input ? input.value.trim() : '';
      var target = './search.html';
      if (value) {
        target += '?q=' + encodeURIComponent(value);
      }
      window.location.href = target;
    });
  });

  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var scopeSelector = panel.getAttribute('data-filter-panel');
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    var search = panel.querySelector('[data-filter-search]');
    var type = panel.querySelector('[data-filter-type]');
    var region = panel.querySelector('[data-filter-region]');
    var year = panel.querySelector('[data-filter-year]');
    var empty = document.querySelector(panel.getAttribute('data-empty-target') || '');
    var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll('.movie-card')) : [];

    function match(card) {
      var keyword = search ? search.value.trim().toLowerCase() : '';
      var typeValue = type ? type.value : '';
      var regionValue = region ? region.value : '';
      var yearValue = year ? year.value : '';
      var text = card.getAttribute('data-text') || '';
      var okKeyword = !keyword || text.indexOf(keyword) !== -1;
      var okType = !typeValue || card.getAttribute('data-kind') === typeValue;
      var okRegion = !regionValue || (card.getAttribute('data-region') || '').indexOf(regionValue) !== -1;
      var okYear = !yearValue || card.getAttribute('data-year') === yearValue;
      return okKeyword && okType && okRegion && okYear;
    }

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var isVisible = match(card);
        card.classList.toggle('hidden-card', !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [search, type, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && search) {
      search.value = query;
    }
    apply();
  });
});
