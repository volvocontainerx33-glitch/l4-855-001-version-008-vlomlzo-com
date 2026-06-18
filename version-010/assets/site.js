(function () {
  var panel = document.querySelector('[data-mobile-panel]');
  var toggle = document.querySelector('[data-menu-toggle]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
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

    function next() {
      show(current + 1);
    }

    function start() {
      stop();
      timer = window.setInterval(next, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    var prev = hero.querySelector('[data-hero-prev]');
    var nextButton = hero.querySelector('[data-hero-next]');

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var filterButtons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
    var activeFilter = 'all';

    if (!input && !filterButtons.length) {
      return;
    }

    if (input && input.getAttribute('data-auto-query') === '1') {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';
      input.value = initial;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function apply() {
      var query = input ? normalize(input.value) : '';
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search-text'));
        var queryMatch = !query || text.indexOf(query) !== -1;
        var filterMatch = activeFilter === 'all' || text.indexOf(normalize(activeFilter)) !== -1;
        card.hidden = !(queryMatch && filterMatch);
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter-value') || 'all';
        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        apply();
      });
    });

    apply();
  });
})();
