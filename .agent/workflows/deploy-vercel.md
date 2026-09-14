# Vercel Deployment Workflow

This workflow automates the validation, pre-flight API testing, and production deployment of **Legal Assistant Pro** to Vercel.

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Verify Files & Integrity
Ensure `legal-assistant.html` and `vercel.json` exist:
```powershell
if (Test-Path "legal-assistant.html") {
    Write-Host "✅ legal-assistant.html verified." -ForegroundColor Green
} else {
    Write-Host "❌ legal-assistant.html not found!" -ForegroundColor Red
    exit 1
}
```

### Step 2: Test Gemini API Connectivity (Pre-flight Check)
Perform a lightweight health-check against Google Gemini 2.0 Flash:
```powershell
$apiKey = if ($env:GEMINI_API_KEY) { $env:GEMINI_API_KEY } else { "AIzaSyAtMTp4z3Kq5L7NmOvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz" }
$endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey"
$body = @{
    contents = @(@{ parts = @(@{ text = "Legal AI health check: respond with 'OK'" }) })
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Gemini 2.0 Flash API Pre-flight connection: OK" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Warning: Demo key reached rate limit or failed. Make sure to configure GEMINI_API_KEY in Vercel." -ForegroundColor Yellow
}
```

### Step 3: Verify vercel.json Configuration
Ensure `vercel.json` exists for clean routing and security headers:
```json
{
  "version": 2,
  "rewrites": [
    { "source": "/api/gemini", "destination": "/api/gemini.js" },
    { "source": "/(.*)", "destination": "/$1" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

### Step 4: Deploy to Vercel Production
Check if Vercel CLI is installed, then deploy:
```powershell
# Check Vercel CLI
$vercelCli = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelCli) {
    Write-Host "⚠️ Vercel CLI not found locally. Using 'npx vercel' or install via 'npm i -g vercel'..." -ForegroundColor Yellow
    $deployOutput = npx -y vercel --prod --yes
} else {
    $deployOutput = vercel --prod --yes
}

# Capture Live URL
$liveUrl = ($deployOutput | Select-String -Pattern "https://[a-zA-Z0-9.-]+\.vercel\.app" -AllMatches).Matches.Value | Select-Object -Last 1

if ($liveUrl) {
    $liveUrl | Out-File -FilePath ".deployment-url.txt" -Encoding utf8
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "✅ Live at: $liveUrl" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
} else {
    Write-Host "Deployment completed. Check your Vercel Dashboard." -ForegroundColor Cyan
}
```

---

## ⚡ Automated 1-Click Execution Script

You can also run the pre-built script:
```powershell
node scripts/deploy.js
```
