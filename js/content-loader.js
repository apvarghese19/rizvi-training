/**
 * FitWell Education — content loader
 * Loads content from localStorage (admin edits) or data/content.json
 */
const CONTENT_KEY = 'fitwell_content';
const ADMIN_PASSWORD = 'fitwell2024';

async function loadContent() {
  const stored = localStorage.getItem(CONTENT_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Invalid stored content, falling back to JSON file.');
    }
  }

  const response = await fetch('data/content.json');
  if (!response.ok) throw new Error('Failed to load content');
  return response.json();
}

function saveContent(content) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

function clearStoredContent() {
  localStorage.removeItem(CONTENT_KEY);
}

function checkAdminPassword(password) {
  return password === ADMIN_PASSWORD;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function renderNav(activePage) {
  const pages = [
    { href: 'index.html', label: 'Home', id: 'home' },
    { href: 'training.html', label: 'Training', id: 'training' },
    { href: 'nutrition.html', label: 'Nutrition', id: 'nutrition' },
    { href: 'lifestyle.html', label: 'Lifestyle', id: 'lifestyle' },
    { href: 'lectures.html', label: 'Lectures', id: 'lectures' },
    { href: 'health-info.html', label: 'Health Info', id: 'health-info' },
    { href: 'blog.html', label: 'Blog', id: 'blog' }
  ];

  return pages.map(p =>
    `<li><a href="${p.href}" class="${activePage === p.id ? 'active' : ''}">${p.label}</a></li>`
  ).join('');
}

function renderHeader(content, activePage) {
  return `
    <header class="site-header">
      <div class="header-inner">
        <div class="logo">
          <a href="index.html">${content.site.title}</a>
          <span>${content.site.tagline}</span>
        </div>
        <nav class="site-nav" aria-label="Main navigation">
          <ul>${renderNav(activePage)}</ul>
        </nav>
      </div>
    </header>`;
}

function renderFooter(content) {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <strong>${content.site.title}</strong>
          <p style="margin:0.5rem 0 0;font-size:0.9rem;">${content.site.about}</p>
        </div>
        <div class="footer-links">
          <a href="training.html">Training</a>
          <a href="nutrition.html">Nutrition</a>
          <a href="lifestyle.html">Lifestyle</a>
          <a href="lectures.html">Lectures</a>
          <a href="health-info.html">Health Info</a>
          <a href="blog.html">Blog</a>
        </div>
      </div>
      <p class="disclaimer">
        This site is for educational purposes only and is not medical advice.
        Consult a qualified healthcare provider before changing your exercise or nutrition routine.
      </p>
    </footer>`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderListItems(items) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;
  if (!page || page === 'admin') return;

  try {
    const content = await loadContent();
    document.title = `${content.site.title} — ${page.charAt(0).toUpperCase() + page.slice(1)}`;

    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    if (headerEl) headerEl.innerHTML = renderHeader(content, page);
    if (footerEl) footerEl.innerHTML = renderFooter(content);

    renderPageContent(page, content);
  } catch (err) {
    console.error(err);
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = '<p style="text-align:center;padding:3rem;">Unable to load content. Please check that data/content.json exists.</p>';
    }
  }
});

function renderPageContent(page, content) {
  switch (page) {
    case 'home':
      renderHome(content);
      break;
    case 'training':
      renderTraining(content);
      break;
    case 'nutrition':
      renderNutrition(content);
      break;
    case 'lifestyle':
      renderLifestyle(content);
      break;
    case 'lectures':
      renderLectures(content);
      break;
    case 'health-info':
      renderHealthInfo(content);
      break;
    case 'blog':
      renderBlog(content);
      break;
  }
}

function renderHome(content) {
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const highlightsGrid = document.getElementById('highlights-grid');

  if (heroTitle) heroTitle.textContent = content.home.heroTitle;
  if (heroSubtitle) heroSubtitle.textContent = content.home.heroSubtitle;

  if (highlightsGrid) {
    highlightsGrid.innerHTML = content.home.highlights.map(h => `
      <a href="${h.link}" class="card" style="text-decoration:none;color:inherit;">
        <div class="feature-icon">${h.icon}</div>
        <h3>${escapeHtml(h.title)}</h3>
        <p>${escapeHtml(h.description)}</p>
      </a>
    `).join('');
  }
}

function renderTraining(content) {
  const intro = document.getElementById('page-intro');
  const grid = document.getElementById('content-grid');
  if (intro) intro.textContent = content.training.intro;
  if (grid) {
    grid.innerHTML = content.training.routines.map(r => `
      <article class="card">
        <div class="card-meta">
          <span class="card-tag">${escapeHtml(r.level)}</span>
          <span>${escapeHtml(r.duration)}</span>
        </div>
        <h3>${escapeHtml(r.title)}</h3>
        <p>${escapeHtml(r.description)}</p>
        <ul>${renderListItems(r.exercises)}</ul>
      </article>
    `).join('');
  }
}

function renderNutrition(content) {
  const intro = document.getElementById('page-intro');
  const grid = document.getElementById('content-grid');
  if (intro) intro.textContent = content.nutrition.intro;
  if (grid) {
    grid.innerHTML = content.nutrition.goals.map(g => `
      <article class="card">
        <h3>${escapeHtml(g.title)}</h3>
        <p>${escapeHtml(g.description)}</p>
        <ul>${renderListItems(g.tips)}</ul>
      </article>
    `).join('');
  }
}

function renderLifestyle(content) {
  const intro = document.getElementById('page-intro');
  const grid = document.getElementById('content-grid');
  if (intro) intro.textContent = content.lifestyle.intro;
  if (grid) {
    grid.innerHTML = content.lifestyle.profiles.map(p => `
      <article class="card">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <ul>${renderListItems(p.recommendations)}</ul>
      </article>
    `).join('');
  }
}

function renderLectures(content) {
  const intro = document.getElementById('page-intro');
  const grid = document.getElementById('content-grid');
  if (intro) intro.textContent = content.lectures.intro;
  if (grid) {
    grid.innerHTML = content.lectures.videos.map(v => {
      const embedUrl = getYouTubeEmbedUrl(v.url);
      const videoHtml = embedUrl
        ? `<iframe src="${embedUrl}" title="${escapeHtml(v.title)}" allowfullscreen loading="lazy"></iframe>`
        : `<div class="video-placeholder">No video URL set</div>`;
      return `
        <article class="card video-card">
          ${videoHtml}
          <div class="card-meta">${escapeHtml(v.duration)}</div>
          <h3>${escapeHtml(v.title)}</h3>
          <p>${escapeHtml(v.description)}</p>
        </article>`;
    }).join('');
  }
}

function renderHealthInfo(content) {
  const intro = document.getElementById('page-intro');
  const grid = document.getElementById('content-grid');
  if (intro) intro.textContent = content.healthInfo.intro;
  if (grid) {
    grid.innerHTML = content.healthInfo.summaries.map(s => `
      <article class="card info-card">
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.summary)}</p>
        <p class="source">Source: ${escapeHtml(s.source)}</p>
      </article>
    `).join('');
  }
}

function renderBlog(content) {
  const intro = document.getElementById('page-intro');
  const list = document.getElementById('blog-list');
  if (intro) intro.textContent = content.blog.intro;
  if (list) {
    list.innerHTML = content.blog.posts.map(p => `
      <article class="blog-post">
        <h3>${escapeHtml(p.title)}</h3>
        <p class="post-date">${escapeHtml(p.date)}</p>
        <p><em>${escapeHtml(p.excerpt)}</em></p>
        <div class="post-content">${escapeHtml(p.content)}</div>
      </article>
    `).join('');
  }
}
