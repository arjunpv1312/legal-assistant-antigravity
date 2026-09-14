// Automated Vercel Deployment & Pre-Flight Verification Script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log('\n⚖️ --- LEGAL ASSISTANT PRO: VERCEL DEPLOYMENT ---');

  // 1. Verify legal-assistant.html
  const htmlPath = path.join(__dirname, '..', 'legal-assistant.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Error: legal-assistant.html not found!');
    process.exit(1);
  }
  console.log('✅ Step 1: legal-assistant.html verified.');

  // 2. Pre-flight API test
  const demoKey = process.env.GEMINI_API_KEY || 'AIzaSyAtMTp4z3Kq5L7NmOvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${demoKey}`;

  console.log('🔍 Step 2: Testing Gemini API connection...');
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Respond with 'OK'" }] }]
      })
    });
    if (res.ok) {
      console.log('✅ Step 2: Gemini 2.0 Flash API Pre-flight connection: OK');
    } else {
      console.log(`⚠️ Step 2: API returned status ${res.status}. (Make sure to set GEMINI_API_KEY in Vercel settings)`);
    }
  } catch (err) {
    console.log('⚠️ Step 2: Pre-flight check network warning:', err.message);
  }

  // 3. Verify vercel.json
  const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
  if (fs.existsSync(vercelJsonPath)) {
    console.log('✅ Step 3: vercel.json verified.');
  }

  // 4. Run Vercel Deploy
  console.log('🚀 Step 4: Running Vercel deployment...');
  let deployCmd = 'npx -y vercel --prod --yes';

  try {
    const output = execSync(deployCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(output);

    // 5. Capture URL
    const match = output.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/g);
    if (match && match.length > 0) {
      const liveUrl = match[match.length - 1];
      fs.writeFileSync(path.join(__dirname, '..', '.deployment-url.txt'), liveUrl, 'utf-8');
      console.log('\n==========================================');
      console.log(`✅ Live at: ${liveUrl}`);
      console.log('==========================================\n');
    } else {
      console.log('✅ Deployment triggered. Check Vercel Dashboard for live URL.');
    }
  } catch (err) {
    console.error('❌ Vercel deployment command failed.');
    console.log('Tip: If Vercel CLI is not authenticated, run:');
    console.log('  npx vercel login');
    console.log('  npx vercel --prod');
  }
}

main();
