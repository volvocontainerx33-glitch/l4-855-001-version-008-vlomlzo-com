(function () {
  function initMoviePlayer(videoId, layerId, file) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    var attached = false;
    var hls = null;

    if (!video || !file) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = file;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(file);
        hls.attachMedia(video);
        return;
      }

      video.src = file;
    }

    function hideLayer() {
      if (layer) {
        layer.classList.add("is-hidden");
      }
    }

    function start() {
      attach();
      hideLayer();
      var playRun = video.play();
      if (playRun && typeof playRun.catch === "function") {
        playRun.catch(function () {});
      }
    }

    if (layer) {
      layer.addEventListener("click", start);
      layer.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          start();
        }
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", hideLayer);

    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
