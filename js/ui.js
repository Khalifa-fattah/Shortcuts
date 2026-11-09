/**
 * UI Renderer & Interaction Controller for Shortcuts Master
 * Handles modal dialogs, in-app confirmations, toasts, custom select menus,
 * kbd formatting, and theme toggling.
 */

class UIManager {
  constructor() {
    this.currentTheme = localStorage.getItem('shortcuts_theme') || 'dark';
    this.confirmEl = null;
    this.confirmState = null;
    this.openSelect = null;
    this.selects = [];
    this._lastWidth = window.innerWidth;
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupGlobalListeners();
  }

  // ===================== THEME MANAGEMENT =====================
  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shortcuts_theme', theme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' ? window.ICONS.sun : window.ICONS.moon;
      themeToggleBtn.setAttribute('title', window.t(theme === 'dark' ? 'themeLight' : 'themeDark'));
    }
  }

  toggleTheme() {
    this.applyTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  // ===================== TOAST NOTIFICATIONS =====================
  /**
   * Show a toast. The message is always rendered as plain text (never HTML).
   */
  showToast(message, type = 'info', duration = 2800) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    // Keep the stack short: drop the oldest toast beyond three.
    while (container.children.length >= 3) container.firstElementChild.remove();

    const iconName = type === 'error' ? 'alert' : type === 'success' ? 'check' : 'info';

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-up`;

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.innerHTML = window.ICONS[iconName];

    const text = document.createElement('span');
    text.className = 'toast-message';
    text.textContent = String(message);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = window.ICONS.close;

    toast.append(icon, text, closeBtn);
    container.appendChild(toast);

    const dismiss = () => {
      if (!toast.isConnected) return;
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 250);
    };
    const timer = setTimeout(dismiss, duration);
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      dismiss();
    });
  }

  // ===================== KEY COMBINATION FORMATTER =====================
  /**
   * Turn "Ctrl + Shift + P / F1" into key chips.
   *  - " + " (or "+") separates the keys of one combination, but a "+" that has
   *    nothing before it is the literal plus key ("Ctrl + + (Plus)").
   *  - " / " and " to " separate alternative combinations; a "/" glued to a
   *    key ("Ctrl + /") is the literal slash key.
   *  - "` (Backquote)" renders the symbol with a small caption.
   */
  formatKeys(keysString) {
    if (!keysString) return '';
    const segments = String(keysString).split(/(\s\/\s|\s+to\s+)/i);
    return segments.map(seg => {
      if (/^\s\/\s$/.test(seg) || /^\s+to\s+$/i.test(seg)) {
        return `<span class="key-separator key-alt">${this.escapeHtml(seg.trim())}</span>`;
      }
      return this.splitKeys(seg)
        .map(k => this.keyChip(k))
        .join('<span class="key-separator">+</span>');
    }).join('');
  }

  splitKeys(segment) {
    const keys = [];
    let current = '';
    for (const ch of String(segment)) {
      if (ch === '+' && current.trim() !== '') {
        keys.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) keys.push(current.trim());
    return keys;
  }

  keyChip(raw) {
    const m = raw.match(/^(\S+)\s+\(([^)]+)\)$/);
    if (m) {
      return `<kbd class="shortcut-key key-has-hint">${this.escapeHtml(m[1])}<small>${this.escapeHtml(m[2])}</small></kbd>`;
    }
    return `<kbd class="shortcut-key">${this.escapeHtml(raw)}</kbd>`;
  }

  escapeHtml(str) {
    if (str === null || str === undefined || str === '') return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /** Accept only #rgb / #rrggbb colors so values can be safely used inside style attributes. */
  safeColor(color, fallback = '#6366F1') {
    const c = String(color || '').trim();
    return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(c) ? c : fallback;
  }

  // ===================== CLIPBOARD COPY =====================
  async copyToClipboard(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https or file-scheme
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      this.showToast(successMessage || window.t('copiedToast', { keys: text }), 'success');
      return true;
    } catch (err) {
      console.error('Copy error:', err);
      this.showToast(window.t('copyFailedToast'), 'error');
      return false;
    }
  }

  // ===================== MODAL MANAGEMENT =====================
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    // Focus the first field on desktop only: on phones it would pop the keyboard open.
    if (!window.matchMedia('(pointer: coarse)').matches) {
      setTimeout(() => {
        const firstInput = modal.querySelector('input:not([type="hidden"]), textarea');
        if (firstInput) firstInput.focus();
      }, 150);
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    this.syncBodyScrollLock();
  }

  closeAllModals() {
    document.querySelectorAll('.modal.active:not(.confirm-modal)').forEach(modal => {
      modal.classList.remove('active');
    });
    this.syncBodyScrollLock();
  }

  syncBodyScrollLock() {
    if (!document.querySelector('.modal.active')) {
      document.body.classList.remove('modal-open');
    }
  }

  // ===================== IN-APP CONFIRM DIALOG =====================
  /**
   * Promise-based replacement for window.confirm() that matches the app design.
   * @returns {Promise<boolean>}
   */
  confirm({ title, message, confirmText, cancelText, danger = false } = {}) {
    return new Promise(resolve => {
      this.ensureConfirmModal();
      if (this.confirmState) this.resolveConfirm(false);

      const el = this.confirmEl;
      el.querySelector('.confirm-title').textContent = title || window.t('confirmTitle');
      el.querySelector('.confirm-message').textContent = message || '';

      const icon = el.querySelector('.confirm-icon');
      icon.className = `confirm-icon${danger ? ' danger' : ''}`;
      icon.innerHTML = danger ? window.ICONS.alert : window.ICONS.info;

      const okBtn = el.querySelector('.confirm-ok');
      const cancelBtn = el.querySelector('.confirm-cancel');
      okBtn.className = `btn ${danger ? 'btn-danger' : 'btn-primary'} confirm-ok`;
      okBtn.textContent = confirmText || window.t('confirmBtn');
      cancelBtn.textContent = cancelText || window.t('cancelBtn');

      this.confirmState = { resolve };
      el.classList.add('active');
      document.body.classList.add('modal-open');
      setTimeout(() => (danger ? cancelBtn : okBtn).focus(), 60);
    });
  }

  ensureConfirmModal() {
    if (this.confirmEl) return;
    const el = document.createElement('div');
    el.className = 'modal confirm-modal';
    el.setAttribute('role', 'alertdialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML = `
      <div class="confirm-backdrop"></div>
      <div class="modal-content">
        <div class="confirm-body">
          <div class="confirm-icon"></div>
          <div class="confirm-text">
            <h3 class="confirm-title"></h3>
            <p class="confirm-message"></p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost confirm-cancel"></button>
          <button type="button" class="btn btn-primary confirm-ok"></button>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector('.confirm-backdrop').addEventListener('click', () => this.resolveConfirm(false));
    el.querySelector('.confirm-cancel').addEventListener('click', () => this.resolveConfirm(false));
    el.querySelector('.confirm-ok').addEventListener('click', () => this.resolveConfirm(true));
    this.confirmEl = el;
  }

  resolveConfirm(result) {
    if (!this.confirmState) return;
    const { resolve } = this.confirmState;
    this.confirmState = null;
    this.confirmEl.classList.remove('active');
    this.syncBodyScrollLock();
    resolve(result);
  }

  // ===================== CUSTOM SELECT MENUS =====================
  /** Replace every native <select> with an app-styled dropdown (bottom sheet on phones). */
  enhanceSelects(root = document) {
    root.querySelectorAll('select:not([data-enhanced])').forEach(sel => this.enhanceSelect(sel));
  }

  enhanceSelect(select) {
    if (select.dataset.enhanced) return;
    select.dataset.enhanced = '1';

    const ui = this;
    const wrap = document.createElement('div');
    wrap.className = `cselect${select.classList.contains('lang-select') ? ' cselect-compact' : ''}`;

    const labelEl = select.id ? document.querySelector(`label[for="${select.id}"]`) : null;
    const title = select.getAttribute('aria-label') || (labelEl ? labelEl.textContent.trim() : '');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cselect-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    if (title) btn.setAttribute('aria-label', title);

    const iconName = select.dataset.cselectIcon;
    btn.innerHTML = `
      ${iconName && window.ICONS[iconName] ? `<span class="cselect-icon">${window.ICONS[iconName]}</span>` : ''}
      <span class="cselect-value"></span>
      <span class="cselect-short"></span>
      <span class="cselect-chevron">${window.ICONS.chevronDown}</span>`;

    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(btn);
    wrap.appendChild(select);
    select.classList.add('cselect-native');
    select.tabIndex = -1;

    const inst = {
      select, wrap, btn, menu: null, backdrop: null, active: -1,

      refresh() {
        const opt = select.options[select.selectedIndex];
        btn.querySelector('.cselect-value').textContent = opt ? opt.textContent : '';
        btn.querySelector('.cselect-short').textContent = (opt && opt.dataset.short) || '';
        btn.disabled = select.disabled;
      },

      isOpen() {
        return ui.openSelect === inst;
      },

      open() {
        if (select.disabled) return;
        if (ui.openSelect && ui.openSelect !== inst) ui.openSelect.close();

        const isSheet = window.matchMedia('(max-width: 680px)').matches;
        const menu = document.createElement('div');
        menu.className = `cselect-menu${isSheet ? ' sheet' : ''}`;
        menu.setAttribute('role', 'listbox');
        menu.style.visibility = 'hidden';

        if (isSheet && title) {
          const head = document.createElement('div');
          head.className = 'cselect-sheet-title';
          head.textContent = title;
          menu.appendChild(head);
        }

        Array.from(select.options).forEach((opt, i) => {
          const item = document.createElement('div');
          item.className = `cselect-option${opt.selected ? ' selected' : ''}`;
          item.setAttribute('role', 'option');
          item.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
          item.dataset.index = String(i);
          item.innerHTML = `<span class="cselect-option-label"></span><span class="cselect-check">${window.ICONS.check}</span>`;
          item.querySelector('.cselect-option-label').textContent = opt.textContent;
          item.addEventListener('click', () => inst.choose(i));
          menu.appendChild(item);
        });

        // Keep keyboard focus on the button while clicking options.
        menu.addEventListener('mousedown', e => e.preventDefault());

        if (isSheet) {
          const backdrop = document.createElement('div');
          backdrop.className = 'cselect-backdrop';
          backdrop.addEventListener('click', () => inst.close());
          document.body.appendChild(backdrop);
          inst.backdrop = backdrop;
        }

        document.body.appendChild(menu);
        inst.menu = menu;
        inst.active = select.selectedIndex;
        ui.openSelect = inst;
        btn.setAttribute('aria-expanded', 'true');
        wrap.classList.add('open');

        if (!isSheet) inst.position();
        menu.style.visibility = '';
        inst.highlight(inst.active, true);
      },

      position() {
        const menu = inst.menu;
        const rect = btn.getBoundingClientRect();
        const rtl = document.documentElement.dir === 'rtl';
        menu.style.minWidth = `${Math.max(rect.width, 150)}px`;

        const menuH = menu.offsetHeight;
        const menuW = menu.offsetWidth;
        const spaceBelow = window.innerHeight - rect.bottom - 12;
        const spaceAbove = rect.top - 12;
        const below = spaceBelow >= Math.min(menuH, 220) || spaceBelow >= spaceAbove;

        const maxH = Math.max(120, below ? spaceBelow : spaceAbove);
        menu.style.maxHeight = `${Math.min(320, maxH)}px`;
        const h = Math.min(menu.offsetHeight, maxH);

        menu.style.top = `${below ? rect.bottom + 6 : rect.top - 6 - h}px`;
        let left = rtl ? rect.right - menuW : rect.left;
        left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));
        menu.style.left = `${left}px`;
      },

      highlight(index, scroll) {
        if (!inst.menu) return;
        const items = inst.menu.querySelectorAll('.cselect-option');
        items.forEach(el => el.classList.remove('active'));
        const target = items[index];
        if (target) {
          target.classList.add('active');
          if (scroll) target.scrollIntoView({ block: 'nearest' });
        }
        inst.active = index;
      },

      move(delta) {
        const count = select.options.length;
        if (!count) return;
        inst.highlight((inst.active + delta + count) % count, true);
      },

      choose(index) {
        if (index < 0 || index >= select.options.length) return;
        const changed = select.selectedIndex !== index;
        select.selectedIndex = index;
        inst.refresh();
        inst.close();
        btn.focus();
        if (changed) select.dispatchEvent(new Event('change', { bubbles: true }));
      },

      close() {
        if (inst.menu) inst.menu.remove();
        if (inst.backdrop) inst.backdrop.remove();
        inst.menu = null;
        inst.backdrop = null;
        btn.setAttribute('aria-expanded', 'false');
        wrap.classList.remove('open');
        if (ui.openSelect === inst) ui.openSelect = null;
      },

      contains(node) {
        return btn.contains(node) || (inst.menu && inst.menu.contains(node));
      }
    };

    btn.addEventListener('click', () => (inst.isOpen() ? inst.close() : inst.open()));
    btn.addEventListener('keydown', e => {
      if (!inst.isOpen()) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          inst.open();
        }
        return;
      }
      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); inst.move(1); break;
        case 'ArrowUp': e.preventDefault(); inst.move(-1); break;
        case 'Home': e.preventDefault(); inst.highlight(0, true); break;
        case 'End': e.preventDefault(); inst.highlight(select.options.length - 1, true); break;
        case 'Enter':
        case ' ': e.preventDefault(); inst.choose(inst.active); break;
        case 'Escape': e.preventDefault(); e.stopPropagation(); inst.close(); break;
        case 'Tab': inst.close(); break;
      }
    });

    // Programmatic `select.value = x` (used all over app.js) must update the custom label.
    const valueProp = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(select, 'value', {
      configurable: true,
      get() { return valueProp.get.call(this); },
      set(v) { valueProp.set.call(this, v); inst.refresh(); }
    });

    select.addEventListener('change', () => inst.refresh());
    if (select.form) select.form.addEventListener('reset', () => setTimeout(() => inst.refresh(), 0));

    inst.refresh();
    this.selects.push(inst);
  }

  // ===================== GLOBAL LISTENERS =====================
  setupGlobalListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.openSelect) {
          this.openSelect.close();
          return;
        }
        if (this.confirmState) {
          this.resolveConfirm(false);
          return;
        }
        this.closeAllModals();
      }
      // Ctrl+K focuses the search box
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    // Close on overlay backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeAllModals();
      }
    });

    // Close an open select menu when clicking elsewhere / scrolling / resizing
    document.addEventListener('pointerdown', (e) => {
      if (this.openSelect && !this.openSelect.contains(e.target)) this.openSelect.close();
    });
    window.addEventListener('scroll', (e) => {
      if (this.openSelect && !(this.openSelect.menu && this.openSelect.menu.contains(e.target))) {
        this.openSelect.close();
      }
    }, true);
    window.addEventListener('resize', () => {
      // Ignore height-only resizes (mobile address bar) so the sheet doesn't flicker shut.
      if (window.innerWidth !== this._lastWidth) {
        this._lastWidth = window.innerWidth;
        if (this.openSelect) this.openSelect.close();
      }
    });

    // Option labels are translated by i18n.apply(): refresh the custom selects afterwards.
    window.addEventListener('languageChanged', () => this.selects.forEach(s => s.refresh()));
  }
}

const ui = new UIManager();

if (typeof window !== 'undefined') {
  window.ui = ui;
}
