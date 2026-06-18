const menuButton = document.querySelector('[data-toggle-menu]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
  });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  let current = 0;

  const activate = (index) => {
    current = index;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      activate(Number(dot.dataset.heroDot || '0'));
    });
  });

  if (slides.length > 1) {
    window.setInterval(() => {
      activate((current + 1) % slides.length);
    }, 5200);
  }
}

const filterPanel = document.querySelector('[data-filter-panel]');

if (filterPanel) {
  const keywordInput = filterPanel.querySelector('[data-filter-keyword]');
  const yearSelect = filterPanel.querySelector('[data-filter-year]');
  const sortSelect = filterPanel.querySelector('[data-sort-movies]');
  const countNode = filterPanel.querySelector('[data-filter-count]');
  const list = document.querySelector('[data-card-list]');
  const cards = list ? Array.from(list.querySelectorAll('[data-movie-card]')) : [];

  const applyFilters = () => {
    const keyword = (keywordInput?.value || '').trim().toLowerCase();
    const year = yearSelect?.value || '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.year,
      ].join(' ').toLowerCase();
      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesYear = !year || card.dataset.year === year;
      const isVisible = matchesKeyword && matchesYear;
      card.style.display = isVisible ? '' : 'none';
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (countNode) {
      countNode.textContent = `显示 ${visibleCount} 部`;
    }
  };

  const sortCards = () => {
    if (!list || !sortSelect) {
      return;
    }
    const value = sortSelect.value;
    const sorted = [...cards].sort((a, b) => {
      if (value === 'views') {
        return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
      }
      if (value === 'score') {
        return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
      }
      if (value === 'year') {
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      }
      return 0;
    });
    sorted.forEach((card) => list.appendChild(card));
    applyFilters();
  };

  keywordInput?.addEventListener('input', applyFilters);
  yearSelect?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', sortCards);
}

const loadHlsVideo = async (video) => {
  const source = video.dataset.src;
  if (!source || video.dataset.loaded === 'true') {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.dataset.loaded = 'true';
    return;
  }

  const { H: Hls } = await import('./hls.js');

  if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) {
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
      }
    });
    video._hlsInstance = hls;
    video.dataset.loaded = 'true';
  }
};

document.querySelectorAll('[data-play-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const targetId = button.dataset.playTarget;
    const video = targetId ? document.getElementById(targetId) : null;
    if (!video) {
      return;
    }

    button.classList.add('is-hidden');

    try {
      await loadHlsVideo(video);
      await video.play();
    } catch (error) {
      button.classList.remove('is-hidden');
      button.querySelector('strong').textContent = '点击重试播放';
      console.error('Video playback failed:', error);
    }
  });
});

const renderSearchResults = () => {
  const resultNode = document.getElementById('search-results');
  const statusNode = document.getElementById('search-status');
  const inputNode = document.getElementById('search-input');

  if (!resultNode || !statusNode || !window.MOVIE_SEARCH_INDEX) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim();

  if (inputNode) {
    inputNode.value = query;
  }

  if (!query) {
    statusNode.textContent = '请输入关键词开始搜索。';
    resultNode.innerHTML = '';
    return;
  }

  const lowerQuery = query.toLowerCase();
  const results = window.MOVIE_SEARCH_INDEX.filter((movie) => {
    return [movie.title, movie.region, movie.genre, movie.tags, movie.year, movie.category]
      .join(' ')
      .toLowerCase()
      .includes(lowerQuery);
  }).slice(0, 120);

  statusNode.textContent = `关键词“${query}”找到 ${results.length} 个结果`;
  resultNode.innerHTML = results.map((movie) => `
    <article class="movie-card" data-movie-card>
      <a class="movie-poster" href="${movie.url}" aria-label="观看 ${escapeHtml(movie.title)}">
        <img src="${movie.cover}" alt="${escapeHtml(movie.title)}" loading="lazy" />
        <span class="poster-gradient"></span>
        <span class="play-badge">▶</span>
        <span class="duration-badge">${escapeHtml(movie.duration)}</span>
      </a>
      <div class="movie-card-body">
        <div class="card-meta">
          <span>${escapeHtml(movie.category)}</span>
          <span>${escapeHtml(movie.year)}</span>
          <span>${escapeHtml(movie.score)}分</span>
        </div>
        <h3><a href="${movie.url}">${escapeHtml(movie.title)}</a></h3>
        <p>${escapeHtml(movie.description)}</p>
        <div class="tag-row">
          ${movie.tags.split(',').slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="card-stats">
          <span>${escapeHtml(movie.region)}</span>
          <span>${escapeHtml(movie.views)}次观看</span>
        </div>
      </div>
    </article>
  `).join('');
};

const escapeHtml = (value) => {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

renderSearchResults();
