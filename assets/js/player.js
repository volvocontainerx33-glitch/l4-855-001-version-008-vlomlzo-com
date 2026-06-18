(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (wrap) {
            var video = wrap.querySelector("video");
            var button = wrap.querySelector("button");
            var hlsInstance = null;
            var loaded = false;

            function load() {
                if (!video || loaded) {
                    return;
                }
                var stream = video.getAttribute("data-stream");
                if (!stream) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls();
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }
                loaded = true;
            }

            function start(event) {
                if (event) {
                    event.preventDefault();
                }
                load();
                wrap.classList.add("is-playing");
                video.setAttribute("controls", "controls");
                var playAttempt = video.play();
                if (playAttempt && typeof playAttempt.catch === "function") {
                    playAttempt.catch(function () {});
                }
            }

            wrap.addEventListener("click", function (event) {
                if (event.target === video && !video.paused) {
                    return;
                }
                start(event);
            });
            if (button) {
                button.addEventListener("click", start);
            }
            video.addEventListener("play", function () {
                wrap.classList.add("is-playing");
            });
            video.addEventListener("emptied", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
                loaded = false;
            });
        });
    });
})();
