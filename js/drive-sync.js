/**
 * Google Drive Cloud Synchronization Module
 * Uses Google Identity Services (GIS) and Google Drive v3 REST API.
 * Uses scope 'https://www.googleapis.com/auth/drive.file' to securely
 * read & write only the files created by this app (shortcuts_master_backup.json).
 */

class GoogleDriveSync {
  constructor() {
    this.tokenClient = null;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.backupFileName = 'shortcuts_master_backup.json';
    this.userEmail = null;
  }

  async getClientId() {
    return await window.db.getSetting('google_client_id', '');
  }

  isConfigured(clientId) {
    return Boolean(clientId && clientId.trim().length > 10);
  }

  hasValidToken() {
    return this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  async ensureGisLoaded() {
    if (window.google?.accounts?.oauth2) return true;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 150));
      if (window.google?.accounts?.oauth2) return true;
    }
    throw new Error('Google Identity Services script failed to load. Please check your internet connection or ad blocker.');
  }

  /**
   * Initialize GIS Token Client
   */
  async initClient(clientId) {
    await this.ensureGisLoaded();

    return new Promise((resolve) => {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email',
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('GIS Error:', tokenResponse);
            throw new Error(tokenResponse.error_description || tokenResponse.error);
          }
          this.accessToken = tokenResponse.access_token;
          // Token valid for ~3599 seconds, give buffer
          this.tokenExpiry = Date.now() + (parseInt(tokenResponse.expires_in, 10) - 60) * 1000;
          resolve(this.accessToken);
        }
      });
    });
  }

  /**
   * Request OAuth Access Token
   */
  async authenticate() {
    const clientId = await this.getClientId();
    if (!this.isConfigured(clientId)) {
      throw new Error('MISSING_CLIENT_ID');
    }

    if (this.hasValidToken()) {
      return this.accessToken;
    }

    if (!this.tokenClient) {
      await this.initClient(clientId);
    }

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = async (resp) => {
        if (resp.error) {
          reject(new Error(resp.error_description || resp.error));
          return;
        }
        this.accessToken = resp.access_token;
        this.tokenExpiry = Date.now() + (parseInt(resp.expires_in, 10) - 60) * 1000;
        
        // Fetch user profile info
        try {
          const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            this.userEmail = userData.email;
            await window.db.saveSetting('drive_user_email', this.userEmail);
          }
        } catch (e) {
          console.warn('Could not fetch user email:', e);
        }

        resolve(this.accessToken);
      };

      // Prompt user to select account
      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  /**
   * Find existing backup file in Google Drive
   */
  async findBackupFile() {
    const q = encodeURIComponent(`name = '${this.backupFileName}' and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id, name, modifiedTime)&spaces=drive`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.files && data.files.length > 0 ? data.files[0] : null;
  }

  /**
   * Backup all local data to Google Drive
   */
  async backupToDrive() {
    await this.authenticate();
    const backupData = await window.db.exportAll();
    const jsonString = JSON.stringify(backupData, null, 2);

    const existingFile = await this.findBackupFile();
    let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    let method = 'POST';

    const metadata = {
      name: this.backupFileName,
      mimeType: 'application/json'
    };

    if (existingFile) {
      url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
      method = 'PATCH';
    }

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      jsonString +
      closeDelimiter;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Backup failed with status ${res.status}`);
    }

    const result = await res.json();
    const syncTime = new Date().toISOString();
    await window.db.saveSetting('drive_last_sync', syncTime);

    return { fileId: result.id, syncTime };
  }

  /**
   * Restore local database from Google Drive backup
   */
  async restoreFromDrive() {
    await this.authenticate();
    const file = await this.findBackupFile();

    if (!file) {
      throw new Error('No backup file found on Google Drive. Create a backup first.');
    }

    const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Download failed with status ${res.status}`);
    }

    const backupData = await res.json();
    await window.db.importAll(backupData);

    const syncTime = new Date().toISOString();
    await window.db.saveSetting('drive_last_sync', syncTime);

    return { restoredCount: backupData.shortcuts?.length || 0, syncTime };
  }
}

const driveSync = new GoogleDriveSync();

if (typeof window !== 'undefined') {
  window.driveSync = driveSync;
}
