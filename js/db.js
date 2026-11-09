/**
 * IndexedDB Database Layer for Shortcuts Master
 * Handles high-capacity offline storage, CRUD operations,
 * automated default seeding, and data import/export.
 */

class ShortcutsDB {
  constructor() {
    this.dbName = 'ShortcutsMasterDB';
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Apps Store
        if (!db.objectStoreNames.contains('apps')) {
          const appStore = db.createObjectStore('apps', { keyPath: 'id' });
          appStore.createIndex('category', 'category', { unique: false });
          appStore.createIndex('name', 'name', { unique: false });
        }

        // Shortcuts Store
        if (!db.objectStoreNames.contains('shortcuts')) {
          const shortcutStore = db.createObjectStore('shortcuts', { keyPath: 'id' });
          shortcutStore.createIndex('appId', 'appId', { unique: false });
          shortcutStore.createIndex('category', 'category', { unique: false });
        }

        // Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = async (event) => {
        this.db = event.target.result;
        // Check if DB is fresh, seed default apps and shortcuts
        await this.seedDefaultsIfEmpty();
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async seedDefaultsIfEmpty() {
    const apps = await this.getAllApps();
    if (!apps || apps.length === 0) {
      console.log('Seeding default shortcuts database...');
      const defaultApps = window.DEFAULT_APPS || [];
      const defaultShortcuts = window.DEFAULT_SHORTCUTS || [];

      const tx = this.db.transaction(['apps', 'shortcuts'], 'readwrite');
      const appStore = tx.objectStore('apps');
      const shortcutStore = tx.objectStore('shortcuts');

      for (const app of defaultApps) {
        appStore.put(app);
      }
      for (const shortcut of defaultShortcuts) {
        shortcutStore.put(shortcut);
      }

      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      console.log('Defaults successfully seeded!');
    }
  }

  // ===================== APPS CRUD =====================
  async getAllApps() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('apps', 'readonly');
      const store = tx.objectStore('apps');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getApp(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('apps', 'readonly');
      const store = tx.objectStore('apps');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveApp(app) {
    if (!app.id) {
      app.id = 'app-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('apps', 'readwrite');
      const store = tx.objectStore('apps');
      const request = store.put(app);
      request.onsuccess = () => resolve(app);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteApp(appId) {
    // Cascade delete all shortcuts belonging to this app
    const shortcuts = await this.getShortcutsByApp(appId);
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['apps', 'shortcuts'], 'readwrite');
      const appStore = tx.objectStore('apps');
      const shortcutStore = tx.objectStore('shortcuts');

      appStore.delete(appId);
      for (const s of shortcuts) {
        shortcutStore.delete(s.id);
      }

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  // ===================== SHORTCUTS CRUD =====================
  async getAllShortcuts() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('shortcuts', 'readonly');
      const store = tx.objectStore('shortcuts');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getShortcutsByApp(appId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('shortcuts', 'readonly');
      const store = tx.objectStore('shortcuts');
      const index = store.index('appId');
      const request = index.getAll(appId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveShortcut(shortcut) {
    if (!shortcut.id) {
      shortcut.id = 'sc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('shortcuts', 'readwrite');
      const store = tx.objectStore('shortcuts');
      const request = store.put(shortcut);
      request.onsuccess = () => resolve(shortcut);
      request.onerror = () => reject(request.error);
    });
  }

  async saveShortcutsBatch(shortcuts) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('shortcuts', 'readwrite');
      const store = tx.objectStore('shortcuts');
      for (const item of shortcuts) {
        if (!item.id) {
          item.id = 'sc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
        }
        store.put(item);
      }
      tx.oncomplete = () => resolve(shortcuts);
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteShortcut(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('shortcuts', 'readwrite');
      const store = tx.objectStore('shortcuts');
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // ===================== SETTINGS CRUD =====================
  async getSetting(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result && request.result.value !== undefined) {
          resolve(request.result.value);
        } else {
          // Fallback to localStorage for easy cross-session persistence
          const ls = localStorage.getItem(`setting_${key}`);
          resolve(ls !== null ? JSON.parse(ls) : defaultValue);
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  }

  async saveSetting(key, value) {
    localStorage.setItem(`setting_${key}`, JSON.stringify(value));
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const request = store.put({ key, value });
      request.onsuccess = () => resolve(value);
      request.onerror = () => reject(request.error);
    });
  }

  // ===================== BACKUP & EXPORT/IMPORT =====================
  async exportAll() {
    const apps = await this.getAllApps();
    const shortcuts = await this.getAllShortcuts();
    return {
      version: 1,
      appName: 'Shortcuts Master',
      exportedAt: new Date().toISOString(),
      apps,
      shortcuts
    };
  }

  async importAll(data) {
    if (!data || !Array.isArray(data.apps) || !Array.isArray(data.shortcuts)) {
      throw new Error('Invalid JSON backup file structure.');
    }

    // Keep only well-formed records: ids, names and key combos must be non-empty strings.
    const isText = (v) => typeof v === 'string' && v.trim() !== '';
    const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
    const apps = data.apps.filter(a => isObj(a) && isText(a.id) && isText(a.name));
    const shortcuts = data.shortcuts.filter(s =>
      isObj(s) && isText(s.id) && isText(s.appId) && isText(s.keys) && isText(s.action));

    if (apps.length === 0 && shortcuts.length === 0) {
      throw new Error('Invalid JSON backup file structure.');
    }

    const tx = this.db.transaction(['apps', 'shortcuts'], 'readwrite');
    const appStore = tx.objectStore('apps');
    const shortcutStore = tx.objectStore('shortcuts');

    for (const app of apps) {
      appStore.put(app);
    }
    for (const shortcut of shortcuts) {
      shortcutStore.put(shortcut);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async resetToDefaults() {
    const tx = this.db.transaction(['apps', 'shortcuts'], 'readwrite');
    tx.objectStore('apps').clear();
    tx.objectStore('shortcuts').clear();

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });

    await this.seedDefaultsIfEmpty();
    return true;
  }
}

const db = new ShortcutsDB();

if (typeof window !== 'undefined') {
  window.db = db;
}
