// Vercel Serverless Function: /api/gemini
// Proxies calls to Google Gemini API securely using GEMINI_API_KEY environment variable

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed. Use POST.' } });
  }

  try {
    const { prompt, contents, generationConfig, systemInstruction, customApiKey } = req.body || {};

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: {
          message: 'No API key provided. Please provide a GEMINI_API_KEY in Vercel environment variables or enter one in the settings modal.'
        }
      });
    }

    const model = 'gemini-2.0-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const requestPayload = {
      contents: contents || [{ parts: [{ text: prompt || '' }] }],
      generationConfig: generationConfig || {
        temperature: 0.3,
        maxOutputTokens: 4096,
        topP: 0.95
      }
    };

    if (systemInstruction) {
      requestPayload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(response.status || 500).json({
        error: {
          message: data.error?.message || `Google API returned status ${response.status}`
        }
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || 'Internal server error while communicating with Gemini API'
      }
    });
  }
}
