(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobilePanel = document.querySelector("[data-mobile-panel]");
        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function () {
                mobilePanel.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var bgs = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-bg]"));
            var next = hero.querySelector("[data-hero-next]");
            var prev = hero.querySelector("[data-hero-prev]");
            var index = 0;

            function show(target) {
                if (!slides.length) {
                    return;
                }
                index = (target + slides.length) % slides.length;
                slides.forEach(function (slide, position) {
                    slide.classList.toggle("active", position === index);
                });
                bgs.forEach(function (bg, position) {
                    bg.classList.toggle("active", position === index);
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(index + 1);
                });
            }
            if (prev) {
                prev.addEventListener("click", function () {
                    show(index - 1);
                });
            }
            show(0);
            window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        var keywordInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-keyword]"));
        if (query && keywordInputs.length) {
            keywordInputs.forEach(function (input) {
                input.value = query;
            });
        }

        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var scope = panel.closest("main") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
            var keyword = panel.querySelector("[data-filter-keyword]");
            var year = panel.querySelector("[data-filter-year]");
            var region = panel.querySelector("[data-filter-region]");
            var type = panel.querySelector("[data-filter-type]");
            var category = panel.querySelector("[data-filter-category]");
            var empty = scope.querySelector("[data-empty-state]");

            function valueOf(element) {
                return element ? element.value.trim().toLowerCase() : "";
            }

            function apply() {
                var kw = valueOf(keyword);
                var selectedYear = valueOf(year);
                var selectedRegion = valueOf(region);
                var selectedType = valueOf(type);
                var selectedCategory = valueOf(category);
                var visible = 0;

                cards.forEach(function (card) {
                    var blob = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-type") || "",
                        card.getAttribute("data-tags") || "",
                        card.getAttribute("data-category") || ""
                    ].join(" ").toLowerCase();

                    var pass = true;
                    if (kw && blob.indexOf(kw) === -1) {
                        pass = false;
                    }
                    if (selectedYear && (card.getAttribute("data-year") || "").toLowerCase() !== selectedYear) {
                        pass = false;
                    }
                    if (selectedRegion && (card.getAttribute("data-region") || "").toLowerCase() !== selectedRegion) {
                        pass = false;
                    }
                    if (selectedType && (card.getAttribute("data-type") || "").toLowerCase() !== selectedType) {
                        pass = false;
                    }
                    if (selectedCategory && (card.getAttribute("data-category") || "").toLowerCase() !== selectedCategory) {
                        pass = false;
                    }
                    card.classList.toggle("hidden-card", !pass);
                    if (pass) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("show", visible === 0);
                }
            }

            [keyword, year, region, type, category].forEach(function (element) {
                if (element) {
                    element.addEventListener("input", apply);
                    element.addEventListener("change", apply);
                }
            });
            apply();
        });
    });
})();
