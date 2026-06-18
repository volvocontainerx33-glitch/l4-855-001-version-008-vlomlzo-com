(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  ready(function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var navMenu = document.querySelector(".nav-menu");
    var topSearch = document.querySelector(".top-search");

    if (menuButton && navMenu && topSearch) {
      menuButton.addEventListener("click", function () {
        navMenu.classList.toggle("open");
        topSearch.classList.toggle("open");
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
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var searchInput = document.querySelector("[data-filter-input]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var genreSelect = document.querySelector("[data-filter-genre]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var noResult = document.querySelector(".no-result");

    function applyFilter() {
      if (!cards.length) {
        return;
      }
      var keyword = normalize(searchInput && searchInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var genre = normalize(genreSelect && genreSelect.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre")
        ].join(" "));
        var cardYear = normalize(card.getAttribute("data-year"));
        var cardGenre = normalize(card.getAttribute("data-genre"));
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && cardYear.indexOf(year) === -1) {
          matched = false;
        }
        if (genre && cardGenre.indexOf(genre) === -1) {
          matched = false;
        }

        card.style.display = matched ? "" : "none";
        if (matched) {
          visibleCount += 1;
        }
      });

      if (noResult) {
        noResult.style.display = visibleCount ? "none" : "block";
      }
    }

    if (searchInput || yearSelect || genreSelect) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q && searchInput) {
        searchInput.value = q;
      }
      [searchInput, yearSelect, genreSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
      applyFilter();
    }
  });

  window.bindPlayer = function (elementId, sourceUrl) {
    var shell = document.getElementById(elementId);
    if (!shell) {
      return;
    }

    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".player-overlay");
    var loading = false;
    var hlsInstance = null;

    function startVideo() {
      if (!video || loading) {
        return;
      }

      loading = true;
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      video.controls = true;

      if (video.getAttribute("data-ready") === "1") {
        video.play().catch(function () {});
        loading = false;
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        video.setAttribute("data-ready", "1");
        video.play().catch(function () {});
        loading = false;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.setAttribute("data-ready", "1");
          video.play().catch(function () {});
          loading = false;
        });
        hlsInstance.on(window.Hls.Events.ERROR, function () {
          loading = false;
        });
        return;
      }

      video.src = sourceUrl;
      video.setAttribute("data-ready", "1");
      video.play().catch(function () {});
      loading = false;
    }

    if (overlay) {
      overlay.addEventListener("click", startVideo);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.getAttribute("data-ready") !== "1") {
          startVideo();
        }
      });
    }
  };
})();
