document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('searchInput');
  var region = document.getElementById('regionFilter');
  var results = document.getElementById('searchResults');
  var summary = document.getElementById('searchSummary');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';

  function imagePath(item) {
    return './' + item.cover + '.jpg';
  }

  function card(item) {
    return [
      '<article class="movie-card">',
      '  <a class="poster" href="' + item.url + '">',
      '    <img src="' + imagePath(item) + '" alt="' + item.title + '" loading="lazy">',
      '    <span class="poster-shade"></span>',
      '    <span class="play-badge">▶</span>',
      '    <span class="year-badge">' + item.year + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <a class="card-title" href="' + item.url + '">' + item.title + '</a>',
      '    <p>' + item.oneLine + '</p>',
      '    <div class="card-meta"><span>' + item.region + '</span><span>' + item.type + '</span></div>',
      '    <div class="tag-row"><span>' + item.category + '</span></div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    var regionValue = region.value;

    if (!q && !regionValue) {
      results.innerHTML = '';
      summary.textContent = '输入关键词开始搜索';
      return;
    }

    var matches = window.SEARCH_INDEX.filter(function (item) {
      var text = [
        item.title,
        item.oneLine,
        item.summary,
        item.region,
        item.type,
        item.genre,
        item.tags,
        item.year,
        item.category
      ].join(' ').toLowerCase();

      var queryMatch = !q || text.indexOf(q) !== -1;
      var regionMatch = !regionValue || item.region.indexOf(regionValue) !== -1;
      return queryMatch && regionMatch;
    }).slice(0, 96);

    summary.textContent = matches.length ? '找到 ' + matches.length + ' 个相关结果' : '没有找到匹配内容';
    results.innerHTML = matches.map(card).join('\n');
  }

  input.value = initialQuery;
  input.addEventListener('input', render);
  region.addEventListener('change', render);
  render();
});
