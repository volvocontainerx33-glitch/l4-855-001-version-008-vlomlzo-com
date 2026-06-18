(function () {
  function onReady(run) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
  }

  onReady(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("active", itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("active", itemIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var filterList = document.querySelector("[data-filter-list]");
    if (filterList) {
      var cards = Array.prototype.slice.call(filterList.querySelectorAll("[data-title]"));
      var keyword = document.querySelector("[data-filter-keyword]");
      var region = document.querySelector("[data-filter-region]");
      var type = document.querySelector("[data-filter-type]");
      var year = document.querySelector("[data-filter-year]");
      var empty = document.querySelector("[data-empty]");
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");

      if (keyword && q && !keyword.value) {
        keyword.value = q;
      }

      function textOf(card) {
        return [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-year") || ""
        ].join(" ").toLowerCase();
      }

      function pass(card) {
        var value = keyword ? keyword.value.trim().toLowerCase() : "";
        var regionValue = region ? region.value : "";
        var typeValue = type ? type.value : "";
        var yearValue = year ? year.value : "";
        var ok = true;

        if (value) {
          ok = textOf(card).indexOf(value) !== -1;
        }
        if (ok && regionValue) {
          ok = (card.getAttribute("data-region") || "").indexOf(regionValue) !== -1;
        }
        if (ok && typeValue) {
          ok = (card.getAttribute("data-type") || "").indexOf(typeValue) !== -1;
        }
        if (ok && yearValue) {
          ok = (card.getAttribute("data-year") || "") === yearValue;
        }

        return ok;
      }

      function applyFilter() {
        var visible = 0;
        cards.forEach(function (card) {
          var ok = pass(card);
          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      [keyword, region, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });

      applyFilter();
    }
  });
})();
