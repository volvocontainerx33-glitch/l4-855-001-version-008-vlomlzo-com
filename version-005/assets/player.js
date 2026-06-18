document.addEventListener('DOMContentLoaded', function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  shells.forEach(function (shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('.play-overlay');
    var stream = video ? video.getAttribute('data-stream') : '';
    var prepared = false;

    function prepare() {
      if (!video || !stream || prepared) {
        return;
      }

      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }

      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(stream);
          hls.attachMedia(video);
          video._hls = hls;
        } else {
          video.src = stream;
        }
      });
    }

    function start() {
      prepare();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var playResult = video.play();

      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });

      video.addEventListener('click', function () {
        prepare();
      }, { once: true });
    }
  });
});
