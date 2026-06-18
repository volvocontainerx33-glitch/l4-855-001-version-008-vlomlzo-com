(function () {
  document.querySelectorAll('[data-player]').forEach(function (shell) {
    var video = shell.querySelector('video');
    var trigger = shell.querySelector('[data-play-trigger]');
    var source = video ? video.getAttribute('data-hls') : '';
    var started = false;
    var hls = null;

    function load() {
      if (!video || !source || started) {
        return;
      }

      started = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      load();
      shell.classList.add('is-playing');
      if (video) {
        var result = video.play();
        if (result && typeof result.catch === 'function') {
          result.catch(function () {});
        }
      }
    }

    if (trigger) {
      trigger.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
