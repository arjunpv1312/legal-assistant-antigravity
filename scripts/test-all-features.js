// Automated Integration Test Runner for LegalBridge — AI Legal Assistant for India's Justice Gap
const fs = require('fs');
const path = require('path');

// 1. Load .env file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function callGeminiTest(prompt, systemInstruction = null) {
  if (!API_KEY) {
    throw new Error("No GEMINI_API_KEY found in environment or .env file.");
  }
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
  };
  if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };

  const start = Date.now();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const duration = Date.now() - start;
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `HTTP error ${res.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from model');
  return { text, duration };
}

async function runSuite() {
  console.log('⚖️ ================================================================');
  console.log('🇮🇳  LEGALBRIDGE — AUTOMATED FEATURE TEST SUITE (INDIA JUSTICE GAP)');
  console.log('⚖️ ================================================================\n');

  let passed = 0;
  const total = 5;
  const results = [];

  // Test 1: Multilingual Document Simplification (Plain Hindi + Plain English)
  try {
    console.log('▶️ [Test 1/5] Multilingual Document Simplification (Hindi + English)...');
    const input = `The Tenant shall pay a refundable security deposit of ₹50,000. In the event of early termination prior to the 11-month lock-in period, the entire deposit shall stand forfeited by the Landlord without demur or dispute.`;
    const prompt = `Simplify this Indian rental agreement clause for an 8th-grade educated citizen. Provide output in two clear sections: 1) सरल हिंदी (Hindi) and 2) Plain English. No legal jargon:\n\n${input}`;
    const { text, duration } = await callGeminiTest(prompt);

    // Verify both Hindi (Devanagari characters) and plain English explanations are present
    const hasHindi = /[\u0900-\u097F]/.test(text); // Check Devanagari script
    const hasEnglishExplanation = /deposit|forfeit|month|landlord|money|rent|security/i.test(text);
    if (!hasHindi || !hasEnglishExplanation) {
      throw new Error("Expected both Devanagari Hindi and Plain English simplification");
    }

    console.log(`   ✅ PASS (${duration}ms) - Dual Hindi + English simplification verified.`);
    results.push({ name: 'Multilingual Simplify', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Multilingual Simplify', status: 'FAIL', error: err.message });
  }

  // Test 2: Risk Scoring (0-100 Meter + Predatory Clause Extraction)
  try {
    console.log('▶️ [Test 2/5] Risk Score & Predatory Clause Extraction (JSON Structure)...');
    const input = `Employee agrees to work for 3 years without salary increment. In case of resignation, Employee must pay ₹3,00,000 as liquidated damages and company retains original educational degree certificates until payment is made.`;
    const prompt = `Analyze this Indian employment bond clause. Output ONLY a valid JSON object with:
{
  "riskScore": (number from 0 to 100, where 0=fair, 100=predatory),
  "riskLevel": ("HIGH" | "MEDIUM" | "LOW"),
  "verdictHindi": "One sentence summary in Hindi",
  "verdictEnglish": "One sentence summary in English",
  "riskyClauses": [
    {
      "clauseQuote": "exact quote",
      "issueHindi": "why dangerous in simple Hindi",
      "issueEnglish": "why dangerous in simple English",
      "severity": "HIGH"
    }
  ]
}

Document:
${input}`;
    const { text, duration } = await callGeminiTest(prompt);

    // Extract JSON from markdown or raw
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object returned by model");
    const parsed = JSON.parse(jsonMatch[0]);

    if (typeof parsed.riskScore !== 'number' || parsed.riskScore < 50) {
      throw new Error(`Expected high predatory risk score (>50), got ${parsed.riskScore}`);
    }
    if (!parsed.riskyClauses || parsed.riskyClauses.length === 0) {
      throw new Error("Expected at least one flagged predatory clause");
    }

    console.log(`   ✅ PASS (${duration}ms) - Risk Score: ${parsed.riskScore}/100 [${parsed.riskLevel}], Flags: ${parsed.riskyClauses.length}`);
    results.push({ name: 'Risk Scoring & Traps', status: 'PASS', duration, score: parsed.riskScore });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Risk Scoring & Traps', status: 'FAIL', error: err.message });
  }

  // Test 3: Rights vs. Obligations (Power Imbalance Detector)
  try {
    console.log('▶️ [Test 3/5] Rights & Obligations Imbalance Detector...');
    const input = `Gig Worker / Delivery Partner shall be solely liable for all traffic accidents, loss of food packages, and customer disputes. The Company may unilaterally reduce delivery payouts and terminate account at any second without reason.`;
    const prompt = `Extract power imbalance from this Indian contract. Extract:
1. MY OBLIGATIONS (मेरी ज़िम्मेदारियाँ)
2. THEIR OBLIGATIONS (उनकी ज़िम्मेदारियाँ)
3. POWER IMBALANCE SUMMARY (असमानता)
Document:
${input}`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasObligations = /obligation|liable|responsibility|imbalance|unilateral|ज़िम्मेदारी/i.test(text);
    if (!hasObligations) throw new Error("Expected obligations and power imbalance extraction");

    console.log(`   ✅ PASS (${duration}ms) - Power imbalance analysis generated.`);
    results.push({ name: 'Rights & Obligations', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Rights & Obligations', status: 'FAIL', error: err.message });
  }

  // Test 4: Voice / Conversational Hindi Q&A (Article 39A / Indian Context)
  try {
    console.log('▶️ [Test 4/5] Conversational Legal Query (Hindi/Voice)...');
    const doc = `11-Month Rental Agreement in New Delhi. Rent ₹15,000. Security Deposit ₹45,000. Notice Period: 1 month by Tenant, immediate eviction by Landlord.`;
    const userQuery = `क्या मकान मालिक बिना 1 महीने के नोटिस के मुझे घर से निकाल सकता है?`;
    const prompt = `Based on Indian rental norms and this document: "${doc}", answer the citizen's question: "${userQuery}". Answer in simple, reassuring Hindi + English bullet points. Mention legal remedy if applicable.`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasHindi = /[\u0900-\u097F]/.test(text);
    const hasLegalContext = /नोटिस|मकान मालिक|किराया|notice|eviction|law|illegal|court|DLSA|rent/i.test(text);
    if (!hasHindi || !hasLegalContext) {
      throw new Error("Expected contextual Hindi answer with legal protection advice");
    }

    console.log(`   ✅ PASS (${duration}ms) - Contextual Hindi Q&A verified.`);
    results.push({ name: 'Voice & Conversational Q&A', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Voice & Conversational Q&A', status: 'FAIL', error: err.message });
  }

  // Test 5: Action Checklist & Free Legal Aid Referral (Article 39A / NALSA)
  try {
    console.log('▶️ [Test 5/5] Action Checklist & Legal Aid Referral (Article 39A)...');
    const input = `Unregistered Tenancy Agreement with unfair 20% annual hike, 6-month security deposit, and no repair obligation by owner.`;
    const prompt = `You are LegalBridge AI assistant for India. Generate a Pre-Signing Action Checklist for this Indian tenant.
Requirements:
1. 5 actionable checkbox items (use "- [ ] Step ...")
2. 3 red flags to question before signing
3. Mention free legal aid options in India: NALSA (Toll-free 15100), Tele-Law (14431), and DLSA under Article 39A of the Indian Constitution.
Document:
${input}`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasHelpLine = /15100|14431|NALSA|Tele-Law|Legal Aid|Article 39A|DLSA|Legal Services/i.test(text);
    const hasChecklist = /\[\s*\]|checklist|step|verify|before signing|1\.|2\./i.test(text);
    if (!hasHelpLine || !hasChecklist) {
      throw new Error("Expected action checklist and Article 39A helpline reference");
    }

    console.log(`   ✅ PASS (${duration}ms) - Action checklist with Article 39A helpline references verified.`);
    results.push({ name: 'Action Checklist & Legal Aid', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Action Checklist & Legal Aid', status: 'FAIL', error: err.message });
  }

  console.log('\n================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed}/${total} Tests Passed`);
  console.log('================================================================\n');

  fs.writeFileSync(
    path.join(__dirname, '..', '.test-results.log'),
    `LegalBridge Test Run: ${new Date().toISOString()}\nPassed: ${passed}/${total}\n\n${JSON.stringify(results, null, 2)}`,
    'utf-8'
  );
}

runSuite();
