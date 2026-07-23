/**
 * FitWell Education — Admin panel
 * Password: fitwell2024 (change in content-loader.js)
 */
document.addEventListener('DOMContentLoaded', async () => {
  const loginView = document.getElementById('login-view');
  const adminView = document.getElementById('admin-view');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const saveBtn = document.getElementById('save-btn');
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFile = document.getElementById('import-file');
  const resetBtn = document.getElementById('reset-btn');
  const statusMsg = document.getElementById('status-msg');

  let content = null;

  function showStatus(message, isSuccess) {
    statusMsg.textContent = message;
    statusMsg.className = 'admin-notice' + (isSuccess ? ' success' : '');
    statusMsg.classList.remove('hidden');
    setTimeout(() => statusMsg.classList.add('hidden'), 4000);
  }

  function showAdmin() {
    loginView.classList.add('hidden');
    adminView.classList.remove('hidden');
    sessionStorage.setItem('fitwell_admin', '1');
    renderEditor();
  }

  function showLogin() {
    loginView.classList.remove('hidden');
    adminView.classList.add('hidden');
    sessionStorage.removeItem('fitwell_admin');
  }

  if (sessionStorage.getItem('fitwell_admin') === '1') {
    showAdmin();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (checkAdminPassword(password)) {
      showAdmin();
    } else {
      showStatus('Incorrect password. Try again.', false);
    }
  });

  logoutBtn.addEventListener('click', showLogin);

  saveBtn.addEventListener('click', () => {
    collectFormData();
    saveContent(content);
    showStatus('Content saved! Changes are visible in this browser immediately.', true);
  });

  exportBtn.addEventListener('click', () => {
    collectFormData();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Downloaded content.json — replace data/content.json in your repo and push to GitHub.', true);
  });

  importBtn.addEventListener('click', () => importFile.click());

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        content = JSON.parse(ev.target.result);
        saveContent(content);
        renderEditor();
        showStatus('Content imported successfully.', true);
      } catch (err) {
        showStatus('Invalid JSON file.', false);
      }
    };
    reader.readAsText(file);
    importFile.value = '';
  });

  resetBtn.addEventListener('click', async () => {
    if (!confirm('Reset to default content from content.json? This clears your local edits.')) return;
    clearStoredContent();
    content = await fetch('data/content.json').then(r => r.json());
    renderEditor();
    showStatus('Reset to default content.', true);
  });

  async function initContent() {
    content = await loadContent();
  }

  function field(id, label, value, type = 'text') {
    if (type === 'textarea') {
      return `
        <div class="form-group">
          <label for="${id}">${label}</label>
          <textarea id="${id}" name="${id}">${escapeHtml(value || '')}</textarea>
        </div>`;
    }
    return `
      <div class="form-group">
        <label for="${id}">${label}</label>
        <input type="text" id="${id}" name="${id}" value="${escapeHtml(value || '')}">
      </div>`;
  }

  function listField(id, label, items) {
    const text = (items || []).join('\n');
    return `
      <div class="form-group">
        <label for="${id}">${label} (one per line)</label>
        <textarea id="${id}" name="${id}" rows="4">${escapeHtml(text)}</textarea>
      </div>`;
  }

  function parseLines(text) {
    return text.split('\n').map(s => s.trim()).filter(Boolean);
  }

  function collectFormData() {
    content.site.title = document.getElementById('site-title').value;
    content.site.tagline = document.getElementById('site-tagline').value;
    content.site.about = document.getElementById('site-about').value;

    content.home.heroTitle = document.getElementById('home-hero-title').value;
    content.home.heroSubtitle = document.getElementById('home-hero-subtitle').value;

    content.training.intro = document.getElementById('training-intro').value;
    content.nutrition.intro = document.getElementById('nutrition-intro').value;
    content.lifestyle.intro = document.getElementById('lifestyle-intro').value;
    content.lectures.intro = document.getElementById('lectures-intro').value;
    content.healthInfo.intro = document.getElementById('health-intro').value;
    content.blog.intro = document.getElementById('blog-intro').value;

    content.home.highlights.forEach((h, i) => {
      h.icon = document.getElementById(`highlight-icon-${i}`).value;
      h.title = document.getElementById(`highlight-title-${i}`).value;
      h.description = document.getElementById(`highlight-desc-${i}`).value;
      h.link = document.getElementById(`highlight-link-${i}`).value;
    });

    content.training.routines.forEach((r, i) => {
      r.title = document.getElementById(`routine-title-${i}`).value;
      r.level = document.getElementById(`routine-level-${i}`).value;
      r.duration = document.getElementById(`routine-duration-${i}`).value;
      r.description = document.getElementById(`routine-desc-${i}`).value;
      r.exercises = parseLines(document.getElementById(`routine-exercises-${i}`).value);
    });

    content.nutrition.goals.forEach((g, i) => {
      g.title = document.getElementById(`goal-title-${i}`).value;
      g.description = document.getElementById(`goal-desc-${i}`).value;
      g.tips = parseLines(document.getElementById(`goal-tips-${i}`).value);
    });

    content.lifestyle.profiles.forEach((p, i) => {
      p.title = document.getElementById(`profile-title-${i}`).value;
      p.description = document.getElementById(`profile-desc-${i}`).value;
      p.recommendations = parseLines(document.getElementById(`profile-recs-${i}`).value);
    });

    content.lectures.videos.forEach((v, i) => {
      v.title = document.getElementById(`video-title-${i}`).value;
      v.description = document.getElementById(`video-desc-${i}`).value;
      v.url = document.getElementById(`video-url-${i}`).value;
      v.duration = document.getElementById(`video-duration-${i}`).value;
    });

    content.healthInfo.summaries.forEach((s, i) => {
      s.title = document.getElementById(`summary-title-${i}`).value;
      s.summary = document.getElementById(`summary-text-${i}`).value;
      s.source = document.getElementById(`summary-source-${i}`).value;
    });

    content.blog.posts.forEach((p, i) => {
      p.title = document.getElementById(`post-title-${i}`).value;
      p.date = document.getElementById(`post-date-${i}`).value;
      p.excerpt = document.getElementById(`post-excerpt-${i}`).value;
      p.content = document.getElementById(`post-content-${i}`).value;
    });
  }

  async function renderEditor() {
    if (!content) await initContent();
    const editor = document.getElementById('editor');
    if (!editor) return;

    let html = '';

    html += `<div class="admin-section"><h2>Site Settings</h2>
      ${field('site-title', 'Site Title', content.site.title)}
      ${field('site-tagline', 'Tagline', content.site.tagline)}
      ${field('site-about', 'About Text', content.site.about, 'textarea')}
    </div>`;

    html += `<div class="admin-section"><h2>Home Page</h2>
      ${field('home-hero-title', 'Hero Title', content.home.heroTitle)}
      ${field('home-hero-subtitle', 'Hero Subtitle', content.home.heroSubtitle, 'textarea')}
    </div>`;

    html += `<div class="admin-section"><h2>Home Highlights</h2>`;
    content.home.highlights.forEach((h, i) => {
      html += `<div class="item-editor">
        <div class="item-editor-header"><h4>Highlight ${i + 1}</h4></div>
        ${field(`highlight-icon-${i}`, 'Icon (emoji)', h.icon)}
        ${field(`highlight-title-${i}`, 'Title', h.title)}
        ${field(`highlight-desc-${i}`, 'Description', h.description, 'textarea')}
        ${field(`highlight-link-${i}`, 'Link', h.link)}
      </div>`;
    });
    html += `</div>`;

    html += `<div class="admin-section"><h2>Training Routines</h2>
      ${field('training-intro', 'Page Intro', content.training.intro, 'textarea')}`;
    content.training.routines.forEach((r, i) => {
      html += `<div class="item-editor">
        <div class="item-editor-header"><h4>Routine ${i + 1}</h4></div>
        <div class="form-row">
          ${field(`routine-title-${i}`, 'Title', r.title)}
          ${field(`routine-level-${i}`, 'Level', r.level)}
        </div>
        ${field(`routine-duration-${i}`, 'Duration', r.duration)}
        ${field(`routine-desc-${i}`, 'Description', r.description, 'textarea')}
        ${listField(`routine-exercises-${i}`, 'Exercises', r.exercises)}
      </div>`;
    });
    html += `</div>`;

    html += `<div class="admin-section"><h2>Nutritional Goals</h2>
      ${field('nutrition-intro', 'Page Intro', content.nutrition.intro, 'textarea')}`;
    content.nutrition.goals.forEach((g, i) => {
      html += `<div class="item-editor">
        <div class="item-editor-header"><h4>Goal ${i + 1}</h4></div>
        ${field(`goal-title-${i}`, 'Title', g.title)}
        ${field(`goal-desc-${i}`, 'Description', g.description, 'textarea')}
        ${listField(`goal-tips-${i}`, 'Tips', g.tips)}
      </div>`;
    });
    html += `</div>`;

    html += `<div class="admin-section"><h2>Lifestyle Profiles</h2>
      ${field('lifestyle-intro', 'Page Intro', content.lifestyle.intro, 'textarea')}`;
    content.lifestyle.profiles.forEach((p, i) => {
      html += `<div class="item-editor">
        <div class="item-editor-header"><h4>Profile ${i + 1}</h4></div>
        ${field(`profile-title-${i}`, 'Title', p.title)}
        ${field(`profile-desc-${i}`, 'Description', p.description, 'textarea')}
        ${listField(`profile-recs-${i}`, 'Recommendations', p.recommendations)}
      </div>`;
    });
    html += `</div>`;

    html += `<div class="admin-section"><h2>Lecture Videos</h2>
      ${field('lectures-intro', 'Page Intro', content.lectures.intro, 'textarea')}`;
    content.lectures.videos.forEach((v, i) => {
      html += `<div class="item-editor">
        <div class="item-editor-header"><h4>Video ${i + 1}</h4></div>
        ${field(`video-title-${i}`, 'Title', v.title)}
        ${field(`video-desc-${i}`, 'Description', v.description, 'textarea')}
        ${field(`video-url-${i}`, 'YouTube URL or embed URL', v.url)}
        ${field(`video-duration-${i}`, 'Duration', v.duration)}
      </div>`;
    });
    html += `</div>`;

    html += `<div class="admin-section"><h2>Health Information</h2>
      ${field('health-intro', 'Page Intro', content.healthInfo.intro, 'textarea')}`;
    content.healthInfo.summaries.forEach((s, i) => {
      html += `<div class="item-editor">
        <div class="item-editor-header"><h4>Summary ${i + 1}</h4></div>
        ${field(`summary-title-${i}`, 'Title', s.title)}
        ${field(`summary-text-${i}`, 'Summary', s.summary, 'textarea')}
        ${field(`summary-source-${i}`, 'Source', s.source)}
      </div>`;
    });
    html += `</div>`;

    html += `<div class="admin-section"><h2>Blog Posts</h2>
      ${field('blog-intro', 'Page Intro', content.blog.intro, 'textarea')}`;
    content.blog.posts.forEach((p, i) => {
      html += `<div class="item-editor">
        <div class="item-editor-header"><h4>Post ${i + 1}</h4></div>
        <div class="form-row">
          ${field(`post-title-${i}`, 'Title', p.title)}
          ${field(`post-date-${i}`, 'Date', p.date)}
        </div>
        ${field(`post-excerpt-${i}`, 'Excerpt', p.excerpt, 'textarea')}
        ${field(`post-content-${i}`, 'Content', p.content, 'textarea')}
      </div>`;
    });
    html += `</div>`;

    editor.innerHTML = html;
  }

  if (sessionStorage.getItem('fitwell_admin') === '1') {
    initContent().then(renderEditor);
  }
});
