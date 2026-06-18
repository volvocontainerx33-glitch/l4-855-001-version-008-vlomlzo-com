document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.player-box').forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-layer');
    var source = box.getAttribute('data-hls');
    var hls = null;
    var prepared = false;

    function playVideo() {
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          box.classList.remove('is-playing');
        });
      }
    }

    function prepare() {
      if (prepared || !source || !video) {
        return;
      }
      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
      } else {
        video.src = source;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
      }
    }

    function start() {
      box.classList.add('is-playing');
      video.controls = true;
      prepare();
      playVideo();
    }

    if (button) {
      button.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  });
});
