/**
 * UI Renderer & Interaction Controller for Shortcuts Master
 * Handles rendering, modal dialogs, notifications, kbd formatting, and theme toggling.
 */

class UIManager {
  constructor() {
    this.toastTimeout = null;
    this.currentTheme = localStorage.getItem('shortcuts_theme') || 'dark';
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
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? window.ICONS.sun 
        : window.ICONS.moon;
      themeToggleBtn.setAttribute('title', window.t(theme === 'dark' ? 'themeLight' : 'themeDark'));
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  // ===================== TOAST NOTIFICATIONS =====================
  showToast(message, type = 'info', duration = 2800) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-up`;
    
    let iconSvg = window.ICONS.check;
    if (type === 'error') iconSvg = window.ICONS.close;
    if (type === 'info') iconSvg = window.ICONS.sparkles;

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ===================== KEY COMBINATION FORMATTER =====================
  formatKeys(keysString) {
    if (!keysString) return '';
    // Normalize delimiters like +, /
    const parts = keysString.split(/(\s*\+\s*|\s*\/\s*|\s+to\s+)/);
    
    return parts.map(part => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      if (trimmed === '+' || trimmed === '/' || trimmed.toLowerCase() === 'to') {
        return `<span class="key-separator">${trimmed}</span>`;
      }
      return `<kbd class="shortcut-key">${this.escapeHtml(trimmed)}</kbd>`;
    }).join(' ');
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
      this.showToast('Failed to copy to clipboard', 'error');
      return false;
    }
  }

  // ===================== MODAL MANAGEMENT =====================
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus first text input
    setTimeout(() => {
      const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) firstInput.focus();
    }, 150);
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    if (!document.querySelector('.modal.active')) {
      document.body.classList.remove('modal-open');
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.classList.remove('modal-open');
  }

  setupGlobalListeners() {
    // ESC key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
      // Ctrl+K opens search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') || document.getElementById('app-search-input');
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
  }
}

const ui = new UIManager();

if (typeof window !== 'undefined') {
  window.ui = ui;
}
