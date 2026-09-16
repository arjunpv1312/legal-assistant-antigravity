// Automated Integration Test Runner for All 5 Legal Tools
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = 'gemini-3.6-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function callGeminiTest(prompt, systemInstruction = null) {
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
  console.log('⚖️ ========================================================');
  console.log('🧪 LEGAL ASSISTANT PRO — AUTOMATED FEATURE TEST SUITE');
  console.log('⚖️ ========================================================\n');

  let passed = 0;
  let total = 5;
  const results = [];

  // Test 1: Simplify Tab Test
  try {
    console.log('▶️ [Test 1/5] Simplify Tab Test...');
    const input = 'The licensor may terminate this license upon 30 days written notice.';
    const prompt = `Simplify this legal document into crystal-clear plain English with summary, rights, and notice period:\n\n${input}`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasTerm = /30\s*days|notice|terminate|cancel/i.test(text);
    if (!hasTerm) throw new Error("Expected plain English termination/notice explanation");

    console.log(`   ✅ PASS (${duration}ms) - Plain English explanation generated.`);
    results.push({ name: 'Simplify Tool', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Simplify Tool', status: 'FAIL', error: err.message });
  }

  // Test 2: Compare Tab Test
  try {
    console.log('▶️ [Test 2/5] Compare Tab Test...');
    const doc1 = 'Liability: Unlimited';
    const doc2 = 'Liability: Limited to $100,000';
    const prompt = `Compare these two contracts. Highlight clear difference and winner:\n\nContract 1:\n${doc1}\n\nContract 2:\n${doc2}`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasDiff = /unlimited|100,000|liability|favorable|difference/i.test(text);
    if (!hasDiff) throw new Error("Expected clear liability variance detection");

    console.log(`   ✅ PASS (${duration}ms) - Liability difference detected.`);
    results.push({ name: 'Compare Tool', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Compare Tool', status: 'FAIL', error: err.message });
  }

  // Test 3: Risk Tab Test
  try {
    console.log('▶️ [Test 3/5] Risk & Clause Audit Test...');
    const input = 'All rights reserved. No refunds under any circumstance.';
    const prompt = `Analyze this contract for legal risks. Output valid JSON with riskLevel, title, and quote:\n\n${input}`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasRisk = /HIGH|refund|risk|hazard|strict/i.test(text);
    if (!hasRisk) throw new Error("Expected HIGH-RISK or strict refund clause identified");

    console.log(`   ✅ PASS (${duration}ms) - High-risk clause identified.`);
    results.push({ name: 'Risk Tool', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Risk Tool', status: 'FAIL', error: err.message });
  }

  // Test 4: Q&A Tab Test
  try {
    console.log('▶️ [Test 4/5] Legal Q&A Test...');
    const doc = 'Payment due within 30 days of invoice date.';
    const q = 'When is payment due?';
    const prompt = `Based on this document: "${doc}", answer the question: "${q}"`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasAnswer = /30\s*days|invoice/i.test(text);
    if (!hasAnswer) throw new Error("Expected '30 days' in answer");

    console.log(`   ✅ PASS (${duration}ms) - Contextual answer verified.`);
    results.push({ name: 'Q&A Tool', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Q&A Tool', status: 'FAIL', error: err.message });
  }

  // Test 5: Checklist Tab Test
  try {
    console.log('▶️ [Test 5/5] Action Checklist Test...');
    const input = 'Client shall pay Consultant $150/hr upon monthly invoicing. Term is 6 months.';
    const prompt = `Generate an action checklist for a Service Agreement with checkboxes, red flags, and attorney questions:\n\n${input}`;
    const { text, duration } = await callGeminiTest(prompt);

    const hasChecklist = /\[\s*\]|checklist|attorney|flags|verify/i.test(text);
    if (!hasChecklist) throw new Error("Expected checkbox format and attorney questions");

    console.log(`   ✅ PASS (${duration}ms) - Action checklist generated.`);
    results.push({ name: 'Checklist Tool', status: 'PASS', duration });
    passed++;
  } catch (err) {
    console.log(`   ❌ FAIL: ${err.message}`);
    results.push({ name: 'Checklist Tool', status: 'FAIL', error: err.message });
  }

  console.log('\n========================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed}/${total} Tests Passed`);
  console.log('========================================================\n');

  fs.writeFileSync(
    path.join(__dirname, '..', '.test-results.log'),
    `Test Run: ${new Date().toISOString()}\nPassed: ${passed}/${total}\n\n${JSON.stringify(results, null, 2)}`,
    'utf-8'
  );
}

runSuite();
