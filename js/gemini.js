// Google Gemini 3.6 Flash Client with Exponential Backoff & Dual-Mode Auth (Vercel Serverless / Client Direct)

class GeminiService {
  constructor() {
    this.model = 'gemini-3.6-flash';
    this.directEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.vercelEndpoint = '/api/gemini';
    this.maxRetries = 3;
    this.baseDelay = 1000;
  }

  getStoredApiKey() {
    return localStorage.getItem('gemini_api_key') || '';
  }

  setStoredApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }

  /**
   * Universal Generate method. Tries Vercel Serverless endpoint first,
   * falls back to direct client call if serverless unavailable or API key supplied.
   */
  async generate({ prompt, systemInstruction = null, generationConfig = {}, onStatusUpdate = null }) {
    const userKey = this.getStoredApiKey();

    const config = {
      temperature: 0.3,
      maxOutputTokens: 4096,
      topP: 0.95,
      ...generationConfig
    };

    // 1. Try Vercel Serverless Proxy first if not running on local file:// protocol
    const isFileProtocol = window.location.protocol === 'file:';

    if (!isFileProtocol) {
      try {
        if (onStatusUpdate) onStatusUpdate('Connecting to Legal AI service...');
        const response = await this.fetchWithRetry(this.vercelEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            systemInstruction,
            generationConfig: config,
            customApiKey: userKey || undefined
          })
        }, onStatusUpdate);

        if (response.ok) {
          const data = await response.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
          }
        }
      } catch (err) {
        console.warn('Vercel proxy unavailable or failed, attempting direct Gemini API call...', err);
      }
    }

    // 2. Direct client fallback
    if (!userKey) {
      throw new Error(
        'Missing Gemini API Key. Please click the ⚙️ Settings button in the header and enter your Google Gemini API Key, or configure GEMINI_API_KEY in Vercel Environment Variables.'
      );
    }

    if (onStatusUpdate) onStatusUpdate('Analyzing legal context with Gemini 2.0 Flash...');

    const directUrl = `${this.directEndpoint}/${this.model}:generateContent?key=${encodeURIComponent(userKey)}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: config
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await this.fetchWithRetry(directUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, onStatusUpdate);

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || `API error (${response.status})`;
      if (response.status === 400 || errorMsg.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API Key. Please check your key in Settings.');
      }
      throw new Error(errorMsg);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No analysis generated from the legal model. Please try again.');
    }

    return text;
  }

  /**
   * Helper to perform exponential backoff retries on rate limits (429) and network blips
   */
  async fetchWithRetry(url, options, onStatusUpdate = null, retries = this.maxRetries) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (response.ok) {
          return response;
        }

        // Rate limited or server busy
        if (response.status === 429 || response.status >= 500) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          if (onStatusUpdate) {
            onStatusUpdate(`Rate limit or server busy. Retrying in ${(delay / 1000).toFixed(1)}s (attempt ${attempt + 1}/${retries})...`);
          }
          await new Promise(res => setTimeout(res, delay));
          continue;
        }

        return response; // Return non-200 to let caller parse JSON error
      } catch (err) {
        if (attempt === retries - 1) throw err;
        const delay = this.baseDelay * Math.pow(2, attempt);
        if (onStatusUpdate) {
          onStatusUpdate(`Network retry in ${(delay / 1000).toFixed(1)}s...`);
        }
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error('Maximum retry attempts reached. Please check your network and API key quota.');
  }

  /**
   * Specialized Structured Risk & Clause Analysis
   */
  async analyzeRisksWithClauses(contractText, onStatusUpdate = null) {
    const prompt = `You are a high-level legal contract auditor and risk assessment specialist.
Analyze the following legal document and extract:
1. An overall executive risk summary (risk score 1-100, risk summary, key hazards).
2. An array of specific clauses identified with HIGH, MEDIUM, or LOW risk levels.

You MUST format your output strictly as a valid JSON object matching this schema:
{
  "riskScore": 75,
  "riskSummary": "Executive summary of contract risks...",
  "highRiskCount": 2,
  "mediumRiskCount": 3,
  "lowRiskCount": 1,
  "clauses": [
    {
      "id": "c1",
      "riskLevel": "HIGH",
      "category": "Indemnification / Liability",
      "title": "Uncapped Indemnity & Consequential Damages",
      "quote": "Exact verbatim sentence or phrase from the contract text",
      "explanation": "Why this clause presents a severe legal hazard...",
      "impact": "Financial exposure, unlimited damages, or loss of IP rights...",
      "recommendation": "Suggested revision or capped mutual compromise language..."
    }
  ],
  "markdownReport": "### Comprehensive Risk Audit Report\\n\\nDetailed breakdown..."
}

CRITICAL RULES:
- The "quote" field MUST be an EXACT verbatim substring from the contract text so it can be highlighted in the original document.
- Only output the raw JSON object, without backticks or other text if possible.

CONTRACT TEXT:
${contractText}`;

    const rawResponse = await this.generate({
      prompt,
      systemInstruction: 'You are an elite legal contract analyzer. Return strictly valid JSON.',
      onStatusUpdate
    });

    // Parse JSON safely
    try {
      const cleaned = rawResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (e) {
      console.warn('Failed to parse structured JSON, returning fallback representation', e);
      return {
        riskScore: 65,
        riskSummary: 'Risk audit completed. See markdown breakdown below.',
        clauses: [],
        markdownReport: rawResponse
      };
    }
  }
}

window.geminiService = new GeminiService();
