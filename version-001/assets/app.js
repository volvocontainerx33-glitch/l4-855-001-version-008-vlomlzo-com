(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function bindMenu() {
        var button = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function bindHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer = null;
        function show(index) {
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
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function bindSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('.page-search, .global-search'));
        var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
        var yearSelect = document.querySelector('.genre-filter');
        if (!inputs.length || !cards.length) {
            return;
        }
        function apply(query) {
            var activeYear = yearSelect ? normalize(yearSelect.value) : '';
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-category'),
                    card.textContent
                ].join(' '));
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchYear = !activeYear || normalize(card.getAttribute('data-year')).indexOf(activeYear) !== -1;
                card.classList.toggle('is-hidden', !(matchQuery && matchYear));
            });
        }
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                var query = normalize(input.value);
                inputs.forEach(function (other) {
                    if (other !== input) {
                        other.value = input.value;
                    }
                });
                apply(query);
            });
        });
        if (yearSelect) {
            yearSelect.addEventListener('change', function () {
                var activeInput = inputs.find(function (item) { return item.value; });
                apply(normalize(activeInput ? activeInput.value : ''));
            });
        }
    }

    window.initMoviePlayer = function (videoId, source, poster) {
        var video = document.getElementById(videoId);
        if (!video) {
            return;
        }
        var shell = video.closest('.player-shell');
        var button = shell ? shell.querySelector('.player-cover-button') : null;
        var hlsInstance = null;
        var loaded = false;

        function load() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (poster) {
                video.setAttribute('poster', poster);
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            load();
            if (shell) {
                shell.classList.add('is-playing');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            if (shell) {
                shell.classList.add('is-playing');
            }
        });
        video.addEventListener('pause', function () {
            if (shell && video.currentTime === 0) {
                shell.classList.remove('is-playing');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        bindMenu();
        bindHero();
        bindSearch();
    });
})();
