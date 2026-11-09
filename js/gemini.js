/**
 * Gemini AI Integration Module
 * Uses the Google Gemini Generative Language REST API to automatically
 * generate, classify, and format keyboard shortcuts for any desktop software.
 *
 * Model ids change over time (older ones get shut down), so besides the
 * built-in fallback list the settings screen can fetch the live list of
 * models available to the user's API key (see listModels).
 */

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta';
const VALID_APP_CATEGORIES = ['system', 'office', 'browser', 'developer', 'custom'];

class GeminiService {
  constructor() {
    this.defaultModel = 'gemini-3.8-flash';
  }

  async getApiKey() {
    return await window.db.getSetting('gemini_api_key', '');
  }

  async getModel() {
    const saved = await window.db.getSetting('gemini_model', this.defaultModel);
    // Models from the 1.x / 2.0 generations have been shut down: fall back to the default.
    if (!saved || /^gemini-(1\.|2\.0)/.test(saved)) return this.defaultModel;
    return saved;
  }

  /**
   * Fetch the list of text-generation Gemini models available to this API key.
   * @returns {Promise<Array<{id: string, label: string}>>}
   */
  async listModels(apiKeyOverride) {
    const apiKey = (apiKeyOverride || await this.getApiKey() || '').trim();
    if (!apiKey) throw new Error('NO_API_KEY');

    const excluded = /(tts|image|live|embedding|audio|robotics|computer-use|transcribe|translate|omni|nano|banana|aqa)/i;
    const models = [];
    let pageToken = '';

    for (let page = 0; page < 5; page++) {
      const url = `${GEMINI_ENDPOINT}/models?pageSize=200${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const res = await fetch(url, { headers: { 'x-goog-api-key': apiKey } });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      for (const m of data.models || []) {
        const id = String(m.name || '').replace(/^models\//, '');
        const methods = m.supportedGenerationMethods || [];
        if (!/^gemini-/.test(id) || excluded.test(id) || !methods.includes('generateContent')) continue;
        models.push({ id, label: m.displayName || id });
      }
      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }

    models.sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
    return models;
  }

  /**
   * Request categorized shortcuts from Gemini AI
   * @param {string} softwareName - The name of the software (e.g. Photoshop, AutoCAD, Slack)
   */
  async generateShortcuts(softwareName) {
    const apiKey = await this.getApiKey();
    if (!apiKey || !apiKey.trim()) {
      throw new Error('NO_API_KEY');
    }

    const model = await this.getModel();
    const endpoint = `${GEMINI_ENDPOINT}/models/${encodeURIComponent(model)}:generateContent`;

    const prompt = `You are an expert keyboard shortcut and productivity specialist for desktop operating systems, especially Windows.
Your task is to generate a comprehensive, accurate list of essential and productivity keyboard shortcuts for the requested application: "${softwareName}".

Requirements:
1. Focus on Windows platform shortcuts (e.g. use Ctrl, Alt, Shift, Win, F-keys).
2. Group the shortcuts into logical, high-value functional categories (e.g., General, Navigation, Editing, Selection, Window/Tabs, Tools, Advanced).
3. Provide at least 15 to 25 of the most useful and commonly used shortcuts.
4. Write key combinations with " + " between keys (e.g. "Ctrl + Shift + N"). When a literal plus key is meant, write "+ (Plus)".
5. Return ONLY a valid, raw JSON object without any Markdown code blocks, backticks, or extra prose.

Required JSON Structure:
{
  "appName": "${softwareName}",
  "nameAr": "Application name in Arabic",
  "category": "system | office | browser | developer | custom",
  "color": "#HexColorCodeMatchingBrand",
  "description": "Brief 1-2 sentence description in English",
  "descriptionAr": "Brief 1-2 sentence description in Arabic",
  "shortcuts": [
    {
      "category": "Category Name in English",
      "categoryAr": "Category Name in Arabic",
      "keys": "e.g. Ctrl + Shift + N",
      "action": "Clear short title of action in English",
      "actionAr": "Clear short title of action in Arabic",
      "description": "Brief explanation of what this shortcut achieves in English",
      "descriptionAr": "Brief explanation in Arabic"
    }
  ]
}`;

    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 16384
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey.trim()
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${response.status} ${response.statusText}`;
      console.error('Gemini API Error:', errMsg);
      if (response.status === 404 || /not found|no longer available|is not supported/i.test(errMsg)) {
        throw new Error('MODEL_UNAVAILABLE');
      }
      throw new Error(`Gemini Error: ${errMsg}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const rawText = (candidate?.content?.parts || [])
      .filter(p => typeof p.text === 'string' && !p.thought)
      .map(p => p.text)
      .join('');

    if (!rawText.trim()) {
      throw new Error('Empty response received from Gemini AI.');
    }

    let parsed;
    try {
      parsed = JSON.parse(this.extractJson(rawText));
    } catch (e) {
      if (candidate?.finishReason === 'MAX_TOKENS') throw new Error('AI_TRUNCATED');
      throw new Error('Invalid JSON format returned by Gemini.');
    }

    return this.sanitizeResult(parsed, softwareName);
  }

  /** Strip markdown fences and surrounding prose, keeping the outer JSON object. */
  extractJson(text) {
    let clean = text.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }
    const first = clean.indexOf('{');
    const last = clean.lastIndexOf('}');
    if (first !== -1 && last !== -1) clean = clean.slice(first, last + 1);
    return clean;
  }

  /** Make sure everything we get from the model is a plain, bounded string. */
  sanitizeResult(parsed, fallbackName) {
    if (!parsed || !Array.isArray(parsed.shortcuts)) {
      throw new Error('Invalid JSON format returned by Gemini.');
    }
    const str = (v, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
    const color = typeof parsed.color === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(parsed.color.trim())
      ? parsed.color.trim() : '';

    const shortcuts = parsed.shortcuts
      .filter(s => s && typeof s === 'object' && str(s.keys) && str(s.action))
      .map(s => ({
        category: str(s.category, 80) || 'General',
        categoryAr: str(s.categoryAr, 80),
        keys: str(s.keys, 80),
        action: str(s.action, 160),
        actionAr: str(s.actionAr, 160),
        description: str(s.description, 400),
        descriptionAr: str(s.descriptionAr, 400)
      }));

    if (shortcuts.length === 0) throw new Error('Invalid JSON format returned by Gemini.');

    return {
      appName: str(parsed.appName, 80) || fallbackName,
      nameAr: str(parsed.nameAr, 80),
      category: VALID_APP_CATEGORIES.includes(parsed.category) ? parsed.category : 'custom',
      color,
      description: str(parsed.description, 400),
      descriptionAr: str(parsed.descriptionAr, 400),
      shortcuts
    };
  }
}

const gemini = new GeminiService();

if (typeof window !== 'undefined') {
  window.gemini = gemini;
}
