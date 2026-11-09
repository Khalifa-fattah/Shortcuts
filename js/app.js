/**
 * Shortcuts Master - Main Application Controller
 * Coordinates Views, Routing, State, Event Listeners, and AI/Sync Integrations.
 */

class AppController {
  constructor() {
    this.currentView = 'home';
    this.currentAppId = null;
    this.apps = [];
    this.shortcuts = [];
    this.activeCategoryFilter = 'all';
    this.activeShortcutCategoryFilter = 'all';
    this.searchQuery = '';
    this.deferredInstallPrompt = null;
    this.aiGeneratedResult = null;
    this.appColorTouched = false;
  }

  async init() {
    // 1. Initialize UI & Theme
    window.ui.init();

    // 2. Initialize Database & Seed data
    await window.db.init();

    // 3. Initialize i18n
    window.i18n.apply();

    // 3b. Replace native <select> menus with the app-styled dropdowns
    window.ui.enhanceSelects();

    // 4. Setup PWA install prompt handler
    this.setupPwaInstall();

    // 5. Register Service Worker for offline capabilities
    this.registerServiceWorker();

    // 6. Bind UI event listeners
    this.bindEvents();

    // 7. Handle URL Hash Navigation
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();

    console.log('Shortcuts Master successfully initialized.');
  }

  // ===================== ROUTING & STATE =====================
  async handleRouting() {
    const hash = window.location.hash || '#';
    this.searchQuery = '';
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.placeholder = window.t('searchPlaceholder');
    }

    if (hash.startsWith('#app/')) {
      const appId = hash.replace('#app/', '').trim();
      await this.openAppDetail(appId);
    } else {
      this.currentView = 'home';
      this.currentAppId = null;
      await this.loadAndRenderHome();
    }
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }

  // ===================== HOME VIEW =====================
  async loadAndRenderHome() {
    this.currentView = 'home';
    this.currentAppId = null;

    document.getElementById('home-view').style.display = 'block';
    document.getElementById('app-detail-view').style.display = 'none';

    this.apps = await window.db.getAllApps();
    this.shortcuts = await window.db.getAllShortcuts();

    this.renderCategoryFilterPills();
    this.renderAppGrid();
  }

  renderCategoryFilterPills() {
    const filterContainer = document.getElementById('category-filter-bar');
    if (!filterContainer) return;

    const categories = [
      { id: 'all', label: window.t('allCategories') },
      { id: 'system', label: window.t('categorySystem') },
      { id: 'office', label: window.t('categoryOffice') },
      { id: 'browser', label: window.t('categoryBrowser') },
      { id: 'developer', label: window.t('categoryDeveloper') },
      { id: 'custom', label: window.t('categoryCustom') }
    ];

    filterContainer.innerHTML = categories.map(cat => `
      <button class="filter-pill ${this.activeCategoryFilter === cat.id ? 'active' : ''}" 
              data-category="${cat.id}">
        ${cat.label}
      </button>
    `).join('');

    filterContainer.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategoryFilter = btn.getAttribute('data-category');
        this.renderCategoryFilterPills();
        this.renderAppGrid();
      });
    });
  }

  renderAppGrid() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;

    const lang = window.i18n.getLang();
    const isAr = lang === 'ar';
    const query = this.searchQuery.toLowerCase().trim();

    // Map shortcut counts per app
    const countMap = {};
    for (const sc of this.shortcuts) {
      countMap[sc.appId] = (countMap[sc.appId] || 0) + 1;
    }

    let filteredApps = this.apps;

    // Filter by Category
    if (this.activeCategoryFilter !== 'all') {
      filteredApps = filteredApps.filter(app => (app.category || 'custom') === this.activeCategoryFilter);
    }

    // Filter by Search query
    if (query) {
      filteredApps = filteredApps.filter(app => {
        const name = (isAr && app.nameAr ? app.nameAr : app.name).toLowerCase();
        const desc = (isAr && app.descriptionAr ? app.descriptionAr : (app.description || '')).toLowerCase();
        // Also check if any shortcut inside this app matches query
        const hasMatchingShortcut = this.shortcuts.some(sc => 
          sc.appId === app.id && (
            sc.keys.toLowerCase().includes(query) ||
            sc.action.toLowerCase().includes(query) ||
            (sc.actionAr && sc.actionAr.toLowerCase().includes(query))
          )
        );
        return name.includes(query) || desc.includes(query) || hasMatchingShortcut;
      });
    }

    if (filteredApps.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${window.ICONS.search}</div>
          <h3>${window.t('noAppsFound')}</h3>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredApps.map(app => {
      const name = isAr && app.nameAr ? app.nameAr : app.name;
      const desc = isAr && app.descriptionAr ? app.descriptionAr : (app.description || '');
      const count = countMap[app.id] || 0;
      const iconHtml = window.getAppIcon(app, 'app-card-icon');
      const accentColor = window.ui.safeColor(app.color);
      const safeId = window.ui.escapeHtml(app.id);

      return `
        <div class="app-card animate-fade-in" data-id="${safeId}" style="--accent-color: ${accentColor}">
          <div class="app-card-header">
            <div class="app-card-icon-wrapper" style="background-color: ${accentColor}18; border-color: ${accentColor}40;">
              ${iconHtml}
            </div>
            <div class="app-card-actions">
              <button class="icon-btn edit-app-btn" title="${window.t('editApp')}" aria-label="${window.t('editApp')}" data-id="${safeId}">
                ${window.ICONS.edit}
              </button>
              <button class="icon-btn delete-app-btn" title="${window.t('deleteApp')}" aria-label="${window.t('deleteApp')}" data-id="${safeId}">
                ${window.ICONS.trash}
              </button>
            </div>
          </div>

          <div class="app-card-body">
            <h3 class="app-card-title">${window.ui.escapeHtml(name)}</h3>
            <p class="app-card-desc">${window.ui.escapeHtml(desc)}</p>
          </div>

          <div class="app-card-footer">
            <span class="badge shortcut-count-badge">
              ${window.t('shortcutsCount', { count })}
            </span>
            <button class="btn btn-outline view-app-btn" data-id="${safeId}">
              ${window.t('openShortcuts')}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind card buttons
    grid.querySelectorAll('.view-app-btn, .app-card-body, .app-card-icon-wrapper').forEach(el => {
      el.addEventListener('click', (e) => {
        const card = e.target.closest('.app-card');
        if (card) {
          this.navigateTo(`#app/${card.getAttribute('data-id')}`);
        }
      });
    });

    grid.querySelectorAll('.edit-app-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditAppModal(btn.getAttribute('data-id'));
      });
    });

    grid.querySelectorAll('.delete-app-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.confirmDeleteApp(btn.getAttribute('data-id'));
      });
    });
  }

  // ===================== APP DETAIL VIEW =====================
  async openAppDetail(appId) {
    this.currentView = 'app-detail';
    this.currentAppId = appId;
    this.activeShortcutCategoryFilter = 'all';

    document.getElementById('home-view').style.display = 'none';
    document.getElementById('app-detail-view').style.display = 'block';

    const app = await window.db.getApp(appId);
    if (!app) {
      this.navigateTo('#');
      return;
    }

    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      const isAr = window.i18n.getLang() === 'ar';
      const appName = isAr && app.nameAr ? app.nameAr : app.name;
      searchInput.placeholder = window.t('searchInAppPlaceholder', { appName });
    }

    const shortcuts = await window.db.getShortcutsByApp(appId);
    this.renderAppDetailHeader(app, shortcuts.length);
    this.renderShortcutCategoryTabs(shortcuts);
    this.renderShortcutsList(app, shortcuts);
  }

  renderAppDetailHeader(app, count) {
    const lang = window.i18n.getLang();
    const isAr = lang === 'ar';
    const name = isAr && app.nameAr ? app.nameAr : app.name;
    const desc = isAr && app.descriptionAr ? app.descriptionAr : (app.description || '');
    const accentColor = window.ui.safeColor(app.color);

    const header = document.getElementById('app-detail-header');
    if (!header) return;

    header.innerHTML = `
      <div class="detail-nav-bar">
        <button id="back-to-apps-btn" class="btn btn-ghost">
          ${window.ICONS.arrowLeft}
          <span>${window.t('backToApps')}</span>
        </button>
      </div>

      <div class="detail-hero" style="--accent-color: ${accentColor}">
        <div class="detail-hero-icon" style="background-color: ${accentColor}20; border-color: ${accentColor}50;">
          ${window.getAppIcon(app, 'hero-icon')}
        </div>
        <div class="detail-hero-info">
          <div class="hero-title-row">
            <h2>${window.ui.escapeHtml(name)}</h2>
            <span class="badge detail-count-badge">${window.t('shortcutsCount', { count })}</span>
          </div>
          <p class="hero-desc">${window.ui.escapeHtml(desc)}</p>
        </div>
        <div class="detail-hero-actions">
          <button id="add-shortcut-btn" class="btn btn-primary">
            ${window.ICONS.plus}
            <span>${window.t('addShortcutBtn')}</span>
          </button>
          <button id="ai-expand-btn" class="btn btn-secondary">
            ${window.ICONS.sparkles}
            <span>${window.t('aiExpandBtn')}</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('back-to-apps-btn').addEventListener('click', () => {
      this.navigateTo('#');
    });

    document.getElementById('add-shortcut-btn').addEventListener('click', () => {
      this.openAddShortcutModal(app.id);
    });

    document.getElementById('ai-expand-btn').addEventListener('click', () => {
      this.openAiModal(app.name, app.category);
    });
  }

  renderShortcutCategoryTabs(shortcuts) {
    const tabsContainer = document.getElementById('shortcut-category-tabs');
    if (!tabsContainer) return;

    const lang = window.i18n.getLang();
    const isAr = lang === 'ar';

    // Collect unique categories
    const categoriesMap = new Map();
    shortcuts.forEach(s => {
      const cat = isAr && s.categoryAr ? s.categoryAr : (s.category || 'General');
      categoriesMap.set(cat, (categoriesMap.get(cat) || 0) + 1);
    });

    let tabsHtml = `
      <button class="category-tab ${this.activeShortcutCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">
        ${window.t('allShortcutsTab')} (${shortcuts.length})
      </button>
    `;

    categoriesMap.forEach((count, cat) => {
      const activeClass = this.activeShortcutCategoryFilter === cat ? 'active' : '';
      tabsHtml += `
        <button class="category-tab ${activeClass}" data-cat="${window.ui.escapeHtml(cat)}">
          ${window.ui.escapeHtml(cat)} (${count})
        </button>
      `;
    });

    tabsContainer.innerHTML = tabsHtml;

    tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeShortcutCategoryFilter = tab.getAttribute('data-cat');
        this.renderShortcutCategoryTabs(shortcuts);
        this.renderShortcutsList(null, shortcuts);
      });
    });
  }

  renderShortcutsList(appParam, allShortcuts) {
    const listContainer = document.getElementById('shortcuts-list');
    if (!listContainer) return;

    const lang = window.i18n.getLang();
    const isAr = lang === 'ar';
    const query = this.searchQuery.toLowerCase().trim();

    let filtered = allShortcuts;

    // Filter by Category
    if (this.activeShortcutCategoryFilter !== 'all') {
      filtered = filtered.filter(s => {
        const cat = isAr && s.categoryAr ? s.categoryAr : (s.category || 'General');
        return cat === this.activeShortcutCategoryFilter;
      });
    }

    // Filter by Search Query
    if (query) {
      filtered = filtered.filter(s => {
        const keys = (s.keys || '').toLowerCase();
        const action = (isAr && s.actionAr ? s.actionAr : s.action).toLowerCase();
        const desc = (isAr && s.descriptionAr ? s.descriptionAr : (s.description || '')).toLowerCase();
        return keys.includes(query) || action.includes(query) || desc.includes(query);
      });
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${window.ICONS.search}</div>
          <h3>${window.t('noShortcutsFound')}</h3>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(item => {
      const action = isAr && item.actionAr ? item.actionAr : item.action;
      const desc = isAr && item.descriptionAr ? item.descriptionAr : (item.description || '');
      const category = isAr && item.categoryAr ? item.categoryAr : (item.category || 'General');
      const formattedKeys = window.ui.formatKeys(item.keys);

      const safeId = window.ui.escapeHtml(item.id);

      return `
        <div class="shortcut-card animate-fade-in" data-id="${safeId}">
          <div class="shortcut-keys-col">
            <div class="keys-display">
              ${formattedKeys}
            </div>
            <button class="btn btn-sm btn-ghost copy-shortcut-btn" data-keys="${window.ui.escapeHtml(item.keys)}" title="${window.t('copyTitle')}">
              ${window.ICONS.copy}
              <span>${window.t('copyBtn')}</span>
            </button>
          </div>

          <div class="shortcut-info-col">
            <div class="shortcut-header-row">
              <h4 class="shortcut-title">${window.ui.escapeHtml(action)}</h4>
              <span class="badge category-badge">${window.ui.escapeHtml(category)}</span>
            </div>
            ${desc ? `<p class="shortcut-desc">${window.ui.escapeHtml(desc)}</p>` : ''}
          </div>

          <div class="shortcut-actions-col">
            <button class="icon-btn edit-shortcut-btn" title="${window.t('editShortcut')}" aria-label="${window.t('editShortcut')}" data-id="${safeId}">
              ${window.ICONS.edit}
            </button>
            <button class="icon-btn delete-shortcut-btn" title="${window.t('deleteShortcut')}" aria-label="${window.t('deleteShortcut')}" data-id="${safeId}">
              ${window.ICONS.trash}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind Shortcut Actions
    listContainer.querySelectorAll('.copy-shortcut-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const keys = btn.getAttribute('data-keys');
        window.ui.copyToClipboard(keys);
      });
    });

    listContainer.querySelectorAll('.edit-shortcut-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditShortcutModal(btn.getAttribute('data-id'));
      });
    });

    listContainer.querySelectorAll('.delete-shortcut-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.confirmDeleteShortcut(btn.getAttribute('data-id'));
      });
    });
  }

  // ===================== MODALS & FORMS =====================
  /** Deterministic accent color for a new app whose color the user left untouched. */
  pickColorForName(name) {
    const palette = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444',
                     '#EC4899', '#8B5CF6', '#14B8A6', '#F97316', '#84CC16'];
    let hash = 0;
    for (const ch of String(name)) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
    return palette[hash % palette.length];
  }

  openAddAppModal() {
    const form = document.getElementById('app-form');
    form.reset();
    document.getElementById('app-form-id').value = '';
    document.getElementById('app-category-select').value = 'custom';
    document.getElementById('app-icon-select').value = 'auto';
    document.getElementById('app-ar-details').open = false;
    this.appColorTouched = false;
    document.getElementById('modal-app-title').textContent = window.t('modalAddAppTitle');
    window.ui.openModal('app-modal');
  }

  async openEditAppModal(appId) {
    const app = await window.db.getApp(appId);
    if (!app) return;

    document.getElementById('modal-app-title').textContent = window.t('modalEditAppTitle');
    document.getElementById('app-form-id').value = app.id;
    document.getElementById('app-name-input').value = app.name || '';
    document.getElementById('app-category-select').value = app.category || 'custom';
    document.getElementById('app-color-input').value = window.ui.safeColor(app.color);
    document.getElementById('app-icon-select').value = app.icon || 'auto';
    document.getElementById('app-desc-input').value = app.description || '';
    document.getElementById('app-name-ar-input').value = app.nameAr || '';
    document.getElementById('app-desc-ar-input').value = app.descriptionAr || '';
    document.getElementById('app-ar-details').open = Boolean(app.nameAr || app.descriptionAr);
    this.appColorTouched = true;

    window.ui.openModal('app-modal');
  }

  async handleAppFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('app-form-id').value.trim();
    const name = document.getElementById('app-name-input').value.trim();
    const category = document.getElementById('app-category-select').value;
    let color = document.getElementById('app-color-input').value;
    const icon = document.getElementById('app-icon-select').value;
    const description = document.getElementById('app-desc-input').value.trim();
    const nameAr = document.getElementById('app-name-ar-input').value.trim();
    const descriptionAr = document.getElementById('app-desc-ar-input').value.trim();

    if (!name) {
      window.ui.showToast(window.t('validationError'), 'error');
      return;
    }

    // A new app whose color was never touched gets a color derived from its name,
    // so automatic letter icons are not all the same indigo.
    if (!id && !this.appColorTouched) color = this.pickColorForName(name);

    // Merge into the stored record so fields not shown in the form are preserved.
    const existing = id ? await window.db.getApp(id) : null;
    const appObj = {
      ...(existing || {}),
      id: id || undefined,
      name,
      nameAr,
      category,
      color,
      icon,
      description,
      descriptionAr
    };

    await window.db.saveApp(appObj);
    window.ui.closeModal('app-modal');
    window.ui.showToast(window.t('savedSuccess'), 'success');

    if (this.currentView === 'home') {
      await this.loadAndRenderHome();
    } else if (this.currentAppId === id) {
      await this.openAppDetail(id);
    }
  }

  async confirmDeleteApp(appId) {
    const ok = await window.ui.confirm({
      message: window.t('confirmDeleteApp'),
      confirmText: window.t('deleteBtn'),
      danger: true
    });
    if (ok) {
      await window.db.deleteApp(appId);
      window.ui.showToast(window.t('deletedSuccess'), 'success');
      if (this.currentView === 'home') {
        await this.loadAndRenderHome();
      } else {
        this.navigateTo('#');
      }
    }
  }

  openAddShortcutModal(appId) {
    const form = document.getElementById('shortcut-form');
    form.reset();
    document.getElementById('shortcut-form-id').value = '';
    document.getElementById('shortcut-app-id').value = appId;
    document.getElementById('shortcut-ar-details').open = false;
    document.getElementById('modal-shortcut-title').textContent = window.t('modalAddShortcutTitle');
    window.ui.openModal('shortcut-modal');
  }

  async openEditShortcutModal(shortcutId) {
    const shortcuts = await window.db.getAllShortcuts();
    const shortcut = shortcuts.find(s => s.id === shortcutId);
    if (!shortcut) return;

    document.getElementById('modal-shortcut-title').textContent = window.t('modalEditShortcutTitle');
    document.getElementById('shortcut-form-id').value = shortcut.id;
    document.getElementById('shortcut-app-id').value = shortcut.appId;
    document.getElementById('shortcut-keys-input').value = shortcut.keys || '';
    document.getElementById('shortcut-action-input').value = shortcut.action || '';
    document.getElementById('shortcut-category-input').value = shortcut.category || '';
    document.getElementById('shortcut-desc-input').value = shortcut.description || '';
    document.getElementById('shortcut-action-ar-input').value = shortcut.actionAr || '';
    document.getElementById('shortcut-category-ar-input').value = shortcut.categoryAr || '';
    document.getElementById('shortcut-desc-ar-input').value = shortcut.descriptionAr || '';
    document.getElementById('shortcut-ar-details').open =
      Boolean(shortcut.actionAr || shortcut.categoryAr || shortcut.descriptionAr);

    window.ui.openModal('shortcut-modal');
  }

  async handleShortcutFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('shortcut-form-id').value.trim();
    const appId = document.getElementById('shortcut-app-id').value.trim();
    const keys = document.getElementById('shortcut-keys-input').value.trim();
    const action = document.getElementById('shortcut-action-input').value.trim();
    const category = document.getElementById('shortcut-category-input').value.trim() || 'General';
    const description = document.getElementById('shortcut-desc-input').value.trim();
    const actionAr = document.getElementById('shortcut-action-ar-input').value.trim();
    const categoryAr = document.getElementById('shortcut-category-ar-input').value.trim();
    const descriptionAr = document.getElementById('shortcut-desc-ar-input').value.trim();

    if (!keys || !action || !appId) {
      window.ui.showToast(window.t('validationError'), 'error');
      return;
    }

    // Merge into the stored record so fields not shown in the form are preserved.
    let existing = null;
    if (id) {
      const appShortcuts = await window.db.getShortcutsByApp(appId);
      existing = appShortcuts.find(s => s.id === id) || null;
    }

    const shortcutObj = {
      ...(existing || {}),
      id: id || undefined,
      appId,
      keys,
      action,
      actionAr,
      category,
      categoryAr,
      description,
      descriptionAr
    };

    await window.db.saveShortcut(shortcutObj);
    window.ui.closeModal('shortcut-modal');
    window.ui.showToast(window.t('savedSuccess'), 'success');

    if (this.currentAppId === appId) {
      await this.openAppDetail(appId);
    }
  }

  async confirmDeleteShortcut(shortcutId) {
    const ok = await window.ui.confirm({
      message: window.t('confirmDeleteShortcut'),
      confirmText: window.t('deleteBtn'),
      danger: true
    });
    if (ok) {
      await window.db.deleteShortcut(shortcutId);
      window.ui.showToast(window.t('deletedSuccess'), 'success');
      if (this.currentAppId) {
        await this.openAppDetail(this.currentAppId);
      }
    }
  }

  // ===================== GEMINI AI GENERATOR =====================
  openAiModal(defaultName = '', defaultCategory = 'custom') {
    const nameInput = document.getElementById('ai-app-name-input');
    const catSelect = document.getElementById('ai-category-select');
    const previewContainer = document.getElementById('ai-preview-container');
    const loadingContainer = document.getElementById('ai-loading-container');
    const importBtn = document.getElementById('ai-import-btn');

    nameInput.value = defaultName;
    if (catSelect) catSelect.value = defaultCategory;
    previewContainer.style.display = 'none';
    loadingContainer.style.display = 'none';
    importBtn.style.display = 'none';
    this.aiGeneratedResult = null;

    window.ui.openModal('ai-modal');
  }

  async handleAiGenerate() {
    const nameInput = document.getElementById('ai-app-name-input');
    const softwareName = nameInput.value.trim();
    if (!softwareName) {
      window.ui.showToast(window.t('validationError'), 'error');
      return;
    }

    const loadingContainer = document.getElementById('ai-loading-container');
    const previewContainer = document.getElementById('ai-preview-container');
    const importBtn = document.getElementById('ai-import-btn');

    loadingContainer.style.display = 'flex';
    previewContainer.style.display = 'none';
    importBtn.style.display = 'none';

    try {
      const result = await window.gemini.generateShortcuts(softwareName);
      this.aiGeneratedResult = result;

      loadingContainer.style.display = 'none';
      previewContainer.style.display = 'block';
      importBtn.style.display = 'inline-flex';

      this.renderAiPreview(result);
    } catch (err) {
      loadingContainer.style.display = 'none';
      if (err.message === 'NO_API_KEY') {
        window.ui.showToast(window.t('aiMissingKeyWarning'), 'error', 4500);
        window.ui.openModal('settings-modal');
      } else if (err.message === 'MODEL_UNAVAILABLE') {
        window.ui.showToast(window.t('aiModelUnavailable'), 'error', 6000);
        this.openSettingsModal();
      } else if (err.message === 'AI_TRUNCATED') {
        window.ui.showToast(window.t('aiTruncated'), 'error', 5000);
      } else {
        window.ui.showToast(`${window.t('aiError')} (${err.message})`, 'error', 5000);
      }
    }
  }

  renderAiPreview(result) {
    const list = document.getElementById('ai-preview-list');
    const title = document.getElementById('ai-preview-title');
    const shortcuts = result.shortcuts || [];

    title.textContent = window.t('aiPreviewTitle', { count: shortcuts.length });

    list.innerHTML = shortcuts.map((s, idx) => `
      <div class="ai-preview-item">
        <label class="ai-preview-checkbox">
          <input type="checkbox" checked data-index="${idx}">
        </label>
        <div class="ai-preview-keys">${window.ui.formatKeys(s.keys)}</div>
        <div class="ai-preview-action">
          <strong>${window.ui.escapeHtml(s.action)}</strong>
          <span class="badge badge-sm">${window.ui.escapeHtml(s.category || 'General')}</span>
        </div>
      </div>
    `).join('');
  }

  async handleAiImport() {
    if (!this.aiGeneratedResult) return;

    const data = this.aiGeneratedResult;
    const selectedIndices = Array.from(document.querySelectorAll('#ai-preview-list input[type="checkbox"]:checked'))
      .map(cb => parseInt(cb.getAttribute('data-index'), 10));

    const selectedShortcuts = selectedIndices.map(i => data.shortcuts[i]).filter(Boolean);

    if (selectedShortcuts.length === 0) {
      window.ui.showToast(window.t('validationError'), 'error');
      return;
    }

    // Check if app already exists by name or currentAppId
    const appName = (data.appName || document.getElementById('ai-app-name-input').value || '').trim();
    let appId = this.currentAppId;
    let existingApp = null;

    if (appId) {
      existingApp = await window.db.getApp(appId);
    } else {
      const allApps = await window.db.getAllApps();
      existingApp = allApps.find(a => a.name.toLowerCase() === appName.toLowerCase());
    }

    if (!existingApp) {
      // Create new application with an automatic letter icon
      const newApp = {
        name: appName,
        nameAr: data.nameAr || appName,
        category: data.category || 'custom',
        color: data.color ? window.ui.safeColor(data.color) : this.pickColorForName(appName),
        icon: 'auto',
        description: data.description || '',
        descriptionAr: data.descriptionAr || ''
      };
      existingApp = await window.db.saveApp(newApp);
    }

    // Batch insert shortcuts
    const shortcutsToSave = selectedShortcuts.map(s => ({
      appId: existingApp.id,
      keys: s.keys,
      action: s.action,
      actionAr: s.actionAr,
      category: s.category || 'General',
      categoryAr: s.categoryAr,
      description: s.description || '',
      descriptionAr: s.descriptionAr || ''
    }));

    await window.db.saveShortcutsBatch(shortcutsToSave);

    window.ui.closeModal('ai-modal');
    window.ui.showToast(window.t('savedSuccess'), 'success');

    // Navigate to this app's details
    this.navigateTo(`#app/${existingApp.id}`);
  }

  // ===================== SETTINGS & GOOGLE DRIVE =====================
  async openSettingsModal() {
    const geminiKey = await window.db.getSetting('gemini_api_key', '');
    const googleClientId = await window.db.getSetting('google_client_id', '');
    const driveEmail = await window.db.getSetting('drive_user_email', '');
    const lastSync = await window.db.getSetting('drive_last_sync', '');

    document.getElementById('gemini-key-input').value = geminiKey;
    this.setModelSelectValue(await window.gemini.getModel());
    document.getElementById('google-client-id-input').value = googleClientId;

    const driveStatusText = document.getElementById('drive-status-text');
    if (driveEmail) {
      driveStatusText.textContent = window.t('driveStatusConnected', { email: driveEmail });
      driveStatusText.className = 'drive-status connected';
    } else {
      driveStatusText.textContent = window.t('driveStatusNotConnected');
      driveStatusText.className = 'drive-status not-connected';
    }

    const driveLastSyncText = document.getElementById('drive-last-sync-text');
    if (lastSync) {
      driveLastSyncText.textContent = window.t('driveLastSync', { time: new Date(lastSync).toLocaleString() });
    } else {
      driveLastSyncText.textContent = '';
    }

    window.ui.openModal('settings-modal');
  }

  /** Select a model in the settings dropdown, adding it to the list if it is not there yet. */
  setModelSelectValue(modelId) {
    const select = document.getElementById('gemini-model-select');
    if (!Array.from(select.options).some(o => o.value === modelId)) {
      select.add(new Option(modelId, modelId), 0);
    }
    select.value = modelId;
  }

  async handleRefreshModels() {
    const btn = document.getElementById('refresh-models-btn');
    const select = document.getElementById('gemini-model-select');
    btn.disabled = true;
    try {
      const typedKey = document.getElementById('gemini-key-input').value.trim();
      const models = await window.gemini.listModels(typedKey);
      if (models.length === 0) throw new Error('0');

      const current = select.value;
      select.innerHTML = '';
      models.forEach(m => select.add(new Option(m.label, m.id)));
      this.setModelSelectValue(models.some(m => m.id === current) ? current : models[0].id);
      window.ui.showToast(window.t('modelsRefreshed', { count: models.length }), 'success');
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        window.ui.showToast(window.t('aiMissingKeyWarning'), 'error', 4500);
      } else {
        window.ui.showToast(window.t('modelsRefreshFailed', { error: err.message }), 'error', 5000);
      }
    } finally {
      btn.disabled = false;
    }
  }

  async saveSettings() {
    const geminiKey = document.getElementById('gemini-key-input').value.trim();
    const geminiModel = document.getElementById('gemini-model-select').value || window.gemini.defaultModel;
    const googleClientId = document.getElementById('google-client-id-input').value.trim();

    await window.db.saveSetting('gemini_api_key', geminiKey);
    await window.db.saveSetting('gemini_model', geminiModel);
    await window.db.saveSetting('google_client_id', googleClientId);

    window.ui.showToast(window.t('settingsSavedToast'), 'success');
  }

  async handleDriveBackup() {
    try {
      window.ui.showToast(window.t('driveStatusSyncing'), 'info');
      const res = await window.driveSync.backupToDrive();
      window.ui.showToast(window.t('driveSyncSuccess'), 'success');
      this.openSettingsModal(); // Refresh sync time display
    } catch (err) {
      if (err.message === 'MISSING_CLIENT_ID') {
        window.ui.showToast(window.t('driveMissingClientId'), 'error');
      } else {
        window.ui.showToast(window.t('driveError', { error: err.message }), 'error', 4500);
      }
    }
  }

  async handleDriveRestore() {
    const ok = await window.ui.confirm({
      message: window.t('driveConfirmRestore'),
      confirmText: window.t('restoreBtn')
    });
    if (!ok) return;

    try {
      if (!(await window.driveSync.getClientId() || '').trim()) {
        window.ui.showToast(window.t('driveMissingClientId'), 'error');
        return;
      }
      window.ui.showToast(window.t('driveStatusSyncing'), 'info');
      await window.driveSync.restoreFromDrive();
      window.ui.showToast(window.t('driveRestoreSuccess'), 'success');
      window.ui.closeModal('settings-modal');
      await this.handleRouting();
    } catch (err) {
      window.ui.showToast(window.t('driveError', { error: err.message }), 'error', 4500);
    }
  }

  async handleExportJson() {
    const data = await window.db.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shortcuts_master_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    window.ui.showToast(window.t('backupDownloaded'), 'success');
  }

  handleImportJsonClick() {
    document.getElementById('import-file-input').click();
  }

  async handleImportFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await window.db.importAll(parsed);
      window.ui.showToast(window.t('importSuccessToast'), 'success');
      window.ui.closeModal('settings-modal');
      await this.handleRouting();
    } catch (err) {
      window.ui.showToast(window.t('importError', { error: err.message }), 'error', 4000);
    } finally {
      e.target.value = '';
    }
  }

  async handleResetDb() {
    const ok = await window.ui.confirm({
      message: window.t('confirmResetDb'),
      confirmText: window.t('resetBtn'),
      danger: true
    });
    if (ok) {
      await window.db.resetToDefaults();
      window.ui.showToast(window.t('resetSuccessToast'), 'success');
      window.ui.closeModal('settings-modal');
      await this.handleRouting();
    }
  }

  // ===================== PWA & SERVICE WORKER =====================
  setupPwaInstall() {
    const installBtn = document.getElementById('install-app-btn');
    if (!installBtn) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      installBtn.style.display = 'inline-flex';
    });

    installBtn.addEventListener('click', async () => {
      if (!this.deferredInstallPrompt) return;
      this.deferredInstallPrompt.prompt();
      const { outcome } = await this.deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
      }
      this.deferredInstallPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
      installBtn.style.display = 'none';
      window.ui.showToast(window.t('pwaInstalled'), 'success');
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then(reg => console.log('Service Worker registered:', reg.scope))
          .catch(err => console.warn('SW registration skipped or failed:', err));
      });
    }
  }

  // ===================== EVENT BINDINGS =====================
  bindEvents() {
    // Theme Switch
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
      window.ui.toggleTheme();
    });

    // Language Switch
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.value = window.i18n.getLang();
      langSelect.addEventListener('change', (e) => {
        window.i18n.setLang(e.target.value);
        this.handleRouting();
      });
    }

    // Settings Modal
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.openSettingsModal();
    });
    document.getElementById('save-settings-btn').addEventListener('click', () => {
      this.saveSettings();
    });

    // Global Search Input
    const globalSearch = document.getElementById('global-search-input');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (this.currentView === 'home') {
          this.renderAppGrid();
        } else if (this.currentAppId) {
          window.db.getShortcutsByApp(this.currentAppId).then(sc => {
            this.renderShortcutsList(null, sc);
          });
        }
      });
    }

    // Add App Buttons
    document.getElementById('add-app-btn').addEventListener('click', () => {
      this.openAddAppModal();
    });
    document.getElementById('ai-generate-app-btn').addEventListener('click', () => {
      this.openAiModal();
    });

    // Remember when the user picks an accent color on purpose
    document.getElementById('app-color-input').addEventListener('input', () => {
      this.appColorTouched = true;
    });

    // Refresh the Gemini model list from the API
    document.getElementById('refresh-models-btn').addEventListener('click', () => {
      this.handleRefreshModels();
    });

    // App Form Submit
    document.getElementById('app-form').addEventListener('submit', (e) => {
      this.handleAppFormSubmit(e);
    });

    // Shortcut Form Submit
    document.getElementById('shortcut-form').addEventListener('submit', (e) => {
      this.handleShortcutFormSubmit(e);
    });

    // Gemini Modal Actions
    document.getElementById('ai-generate-btn').addEventListener('click', () => {
      this.handleAiGenerate();
    });
    document.getElementById('ai-import-btn').addEventListener('click', () => {
      this.handleAiImport();
    });

    // Google Drive Actions
    document.getElementById('drive-backup-btn').addEventListener('click', () => {
      this.handleDriveBackup();
    });
    document.getElementById('drive-restore-btn').addEventListener('click', () => {
      this.handleDriveRestore();
    });

    // Local JSON Export/Import & Reset
    document.getElementById('export-json-btn').addEventListener('click', () => {
      this.handleExportJson();
    });
    document.getElementById('import-json-btn').addEventListener('click', () => {
      this.handleImportJsonClick();
    });
    document.getElementById('import-file-input').addEventListener('change', (e) => {
      this.handleImportFileChange(e);
    });
    document.getElementById('reset-db-btn').addEventListener('click', () => {
      this.handleResetDb();
    });

    // Modal Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        window.ui.closeModal(modalId);
      });
    });
  }
}

const app = new AppController();
window.app = app;

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
