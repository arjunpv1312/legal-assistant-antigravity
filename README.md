# ⚖️ Legal Assistant Pro

> **AI for Legal Assistance & Access &bull; PromptWars Challenge 5**  
> *Understand. Compare. Navigate.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Powered by Gemini 2.0 Flash](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-4285F4.svg)](https://deepmind.google/technologies/gemini/)
[![Deployment: Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

---

## 📌 Problem Statement

Complex legal documents are intentionally filled with dense legalese, hidden liability traps, and asymmetric terms that ordinary people and small business owners cannot easily understand. Hiring attorneys for routine contract reviews is prohibitively slow and expensive, creating a severe justice and accessibility gap.

---

## 💡 Solution Overview

**Legal Assistant Pro** is an all-in-one AI legal copilot powered by **Google Gemini 2.0 Flash** that democratizes legal understanding. It provides 5 specialized tools in a single, zero-build web application:

1. **📄 Document Simplifier:** Translates dense contracts into crystal-clear plain English, highlighting rights, obligations, and penalties.
2. **⚠️ Risk & Clause Audit:** Scores contracts (0-100), detects liability hazards, and features an interactive **Inline Clause Heatmap** with counter-proposal suggestions.
3. **🔄 Contract Comparator:** Performs side-by-side contract variance analysis with a clause-by-clause discrepancy matrix.
4. **❓ Legal Q&A Assistant:** Answers specific questions with direct citations and practical impact explanations.
5. **✅ Action Checklist Generator:** Formulates role-based pre-signing checklists, deal-breaker alerts, and attorney talking points.

---

## ✨ Features

- 📎 **Drag-and-Drop PDF Ingestion:** Upload multi-page PDFs or text documents with client-side text extraction via PDF.js.
- 📥 **Export to PDF:** Download branded, high-resolution legal audit reports with timestamps and risk counters using html2pdf.js.
- 🔎 **Interactive Inline Clause Highlighter:** Visual color-coded tags (🔴 High Risk, 🟡 Ambiguity, 🟢 Standard) with a click-to-inspect drawer and 1-click copyable counter-terms.
- 📂 **Sample Contracts Loader:** Instant 1-click presets (Mutual NDA, SaaS Terms, Contractor Agreement, Commercial Triple-Net Lease) for rapid evaluation.
- 🕒 **LocalStorage History:** Automatically saves the last 5 document analyses for instant 1-click restore.
- ⚙️ **Judge / Custom API Key Modal:** Easily paste a personal Gemini API key or use demo fallback with automatic exponential backoff retry.
- 🛡️ **Zero-Build & XSS Safe:** Pure HTML5, Tailwind CSS, DOMPurify sanitization, and responsive glassmorphism UI.

---

## 🚀 How to Use

1. **Upload or Paste:** Drag and drop a PDF/document or paste contract text into any tool (or click **📂 Sample Contracts** for demo agreements).
2. **Click Action:** Click the tool button (e.g., *🚀 Simplify Document*, *⚠️ Audit Risks*, *🔍 Compare Contracts*).
3. **Inspect & Export:** Review the plain-English breakdown, click highlighted clauses for counter-terms, or click **📥 Export PDF** to download the audit report.

---

## 🛠️ Tech Stack

- **Frontend:** Single-file HTML5, Vanilla JavaScript (ES6+), Plus Jakarta Sans & JetBrains Mono typography
- **Styling:** Tailwind CSS (via CDN) with custom glassmorphism and animation system
- **AI Model:** Google Gemini 2.0 Flash (`gemini-2.0-flash`) with exponential backoff retry handling
- **Document Processing:** PDF.js (`pdfjs-dist`) for extraction, Mammoth.js for Word parsing, Marked.js & DOMPurify for secure markdown rendering
- **PDF Generation:** html2pdf.js & jsPDF for formatted legal report exports
- **Hosting:** Vercel (zero-config static deployment)

---

## 💻 Local Testing Instructions

Run Legal Assistant Pro locally with no build step required:

```bash
# 1. Clone the repository
git clone https://github.com/arjunpv1312/legal-assistant-antigravity.git
cd legal-assistant-antigravity

# 2. Launch using any local static server
npx serve .
# or simply double-click legal-assistant.html in your file explorer!
```

Open `http://localhost:3000` (or `legal-assistant.html`) in any modern web browser. Click the **⚙️ API Key** button in the header to enter your Google Gemini API key if needed.

---

## 📸 Screenshots & Demo Media

Place your screenshots or walkthrough demo GIF in the `assets/` folder:

```
assets/
├── demo-walkthrough.gif     # 3-minute overview walkthrough
├── risk-highlighter.png     # Screenshot of the interactive clause heatmap
└── comparison-matrix.png    # Screenshot of the side-by-side comparator
```

Embed syntax:
```markdown
![Legal Assistant Pro Walkthrough](assets/demo-walkthrough.gif)
```

---

## ⚖️ Legal Disclaimer

*Legal Assistant Pro provides assistive artificial intelligence analysis for informational and educational purposes only and does not constitute formal legal advice, representation, or an attorney-client relationship.*

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright (c) 2026 Arjun PV ([@arjunpv1312](https://github.com/arjunpv1312)).
