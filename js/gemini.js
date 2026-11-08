/**
 * Gemini AI Integration Module
 * Uses Google Gemini Generative Language REST API to automatically
 * generate, classify, and format keyboard shortcuts for any desktop software.
 */

class GeminiService {
  constructor() {
    this.defaultModel = 'gemini-1.5-flash';
  }

  async getApiKey() {
    return await window.db.getSetting('gemini_api_key', '');
  }

  async getModel() {
    return await window.db.getSetting('gemini_model', this.defaultModel);
  }

  /**
   * Request categorized shortcuts from Gemini AI
   * @param {string} softwareName - The name of the software (e.g. Photoshop, AutoCAD, Slack)
   * @param {string} lang - 'en' or 'ar'
   */
  async generateShortcuts(softwareName, lang = 'en') {
    const apiKey = await this.getApiKey();
    if (!apiKey || !apiKey.trim()) {
      throw new Error('NO_API_KEY');
    }

    const model = await this.getModel();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

    const isAr = lang === 'ar';
    const systemPrompt = `You are an expert keyboard shortcut and productivity specialist for desktop operating systems, especially Windows.
Your task is to generate a comprehensive, accurate list of essential and productivity keyboard shortcuts for the requested application: "${softwareName}".

Requirements:
1. Focus on Windows platform shortcuts (e.g. use Ctrl, Alt, Shift, Win, F-keys).
2. Group the shortcuts into logical, high-value functional categories (e.g., General, Navigation, Editing, Selection, Window/Tabs, Tools, Advanced).
3. Provide at least 15 to 25 of the most useful and commonly used shortcuts.
4. Return ONLY a valid, raw JSON object without any Markdown code blocks, backticks, or extra prose.

Required JSON Structure:
{
  "appName": "${softwareName}",
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
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${response.status} ${response.statusText}`;
        console.error('Gemini API Error:', errMsg);
        throw new Error(`Gemini Error: ${errMsg}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response received from Gemini AI.');
      }

      // Clean markdown code blocks and extract pure JSON object
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }

      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = cleanJson.slice(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleanJson);
      if (!parsed.shortcuts || !Array.isArray(parsed.shortcuts)) {
        throw new Error('Invalid JSON format returned by Gemini.');
      }

      return parsed;
    } catch (err) {
      console.error('Failed to generate shortcuts via Gemini:', err);
      throw err;
    }
  }
}

const gemini = new GeminiService();

if (typeof window !== 'undefined') {
  window.gemini = gemini;
}
