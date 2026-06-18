document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterList = document.querySelector('[data-filter-list]');
  var sortSelect = document.querySelector('[data-sort-select]');

  function applyFilter() {
    if (!filterInput || !filterList) {
      return;
    }

    var value = filterInput.value.trim().toLowerCase();
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.textContent
      ].join(' ').toLowerCase();

      card.classList.toggle('is-filter-hidden', value && text.indexOf(value) === -1);
    });
  }

  function applySort() {
    if (!sortSelect || !filterList) {
      return;
    }

    var mode = sortSelect.value;
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

    cards.sort(function (a, b) {
      if (mode === 'year') {
        return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
      }

      if (mode === 'title') {
        return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-CN');
      }

      return 0;
    });

    cards.forEach(function (card) {
      filterList.appendChild(card);
    });

    applyFilter();
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applySort);
  }
});
