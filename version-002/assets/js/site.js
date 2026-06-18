(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-nav-menu]");
        var search = document.querySelector(".nav-search");

        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
                if (search) {
                    search.classList.toggle("is-open");
                }
            });
        }

        var slider = document.querySelector("[data-hero-slider]");
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(document.querySelectorAll("[data-slide-dot]"));
            var prev = document.querySelector("[data-slide-prev]");
            var next = document.querySelector("[data-slide-next]");
            var current = 0;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === current);
                });
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                });
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });

            show(0);
            window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        var filterInput = document.querySelector("[data-filter-input]");
        var categorySelect = document.querySelector("[data-filter-category]");
        var yearSelect = document.querySelector("[data-filter-year]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var empty = document.querySelector("[data-empty-state]");

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function runFilter() {
            if (!cards.length) {
                return;
            }

            var q = normalize(filterInput ? filterInput.value : "");
            var cat = categorySelect ? categorySelect.value : "";
            var year = yearSelect ? yearSelect.value : "";
            var shown = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var cardCat = card.getAttribute("data-category") || "";
                var matchText = !q || text.indexOf(q) !== -1;
                var matchCat = !cat || cardCat === cat;
                var matchYear = !year || text.indexOf(year) !== -1;
                var visible = matchText && matchCat && matchYear;

                card.classList.toggle("hidden-by-filter", !visible);
                if (visible) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }

        if (filterInput || categorySelect || yearSelect) {
            var params = new URLSearchParams(window.location.search);
            var qParam = params.get("q");
            if (qParam && filterInput) {
                filterInput.value = qParam;
            }

            if (filterInput) {
                filterInput.addEventListener("input", runFilter);
            }

            if (categorySelect) {
                categorySelect.addEventListener("change", runFilter);
            }

            if (yearSelect) {
                yearSelect.addEventListener("change", runFilter);
            }

            runFilter();
        }
    });
})();
