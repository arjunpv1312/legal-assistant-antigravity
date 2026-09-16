# ⚖️ Legal Assistant Pro — Understand. Compare. Navigate.

[![Gemini](https://img.shields.io/badge/AI_Engine-Google_Gemini_3.6_Flash-blue?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![PromptWars](https://img.shields.io/badge/Challenge-PromptWars_5:_Legal_AI-indigo?style=for-the-badge)](https://github.com/arjunpv1312/legal-assistant-antigravity)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Single File App](https://img.shields.io/badge/Architecture-Single--File_Static_HTML5-orange?style=for-the-badge)](#-tech-stack)

> **All-in-One GenAI Legal Intelligence Platform** built for **PromptWars Challenge 5: AI for Legal Assistance & Access**.  
> Simplifies dense legalese into plain English, audits contracts for punitive liabilities with visual heatmaps, compares agreement drafts side-by-side, provides cited legal Q&A, and generates actionable pre-signing negotiation checklists.

---

## 🎯 The Problem
Legal documents are deliberately engineered for lawyers, not ordinary people. Every day, freelancers, startup founders, consumers, and students sign agreements packed with:
- **Uncapped indemnities & perpetual survival clauses**
- **Hidden auto-renewals with strict penalty windows**
- **Broad IP work-for-hire assignment traps**
- **One-sided limitation-of-liability waivers**

Professional legal review costs upwards of **$400–$800/hour**, leaving over **80% of individuals and small businesses unprotected**.

---

## ✨ The Solution: 5 AI Legal Tools in 1 Interface

Legal Assistant Pro puts an elite, instantaneous legal analyst directly into your browser:

```
+-----------------------------------------------------------------------------------+
|                            ⚖️ LEGAL ASSISTANT PRO                                 |
+-----------------------------------------------------------------------------------+
|  [📄 Document Simplifier]  [⚠️ Risk Audit]  [🔄 Comparator]  [❓ Q&A]  [✅ Checklist] |
+-----------------------------------------------------------------------------------+
|  • Drag & Drop PDF Ingestion (Client-side extraction via PDF.js)                  |
|  • Powered by Google Gemini 3.6 Flash with Exponential Backoff Resilience          |
|  • Client-Side Gate Modal (Zero Hardcoded Keys - BYOK Security Architecture)       |
|  • Interactive Clause Heatmap with 1-Click Counter-Proposals                      |
|  • Branded PDF Export Engine (html2pdf.js)                                        |
|  • Dark / Light Theme & Keyboard Shortcuts (Ctrl+Enter / Ctrl+K)                  |
+-----------------------------------------------------------------------------------+
```

### 🛠️ Core Capabilities

| Tool | Purpose | Key Output & Features |
| :--- | :--- | :--- |
| 📄 **Document Simplifier** | Converts 20-page legal jargon into crystal-clear plain English. | Structured breakdown of Rights, Obligations, Financial Penalties, and Termination Windows. |
| ⚠️ **Risk & Clause Audit** | Detects hidden liabilities, one-sided covenants, and unfair terms. | **Executive Risk Score (0-100)**, high/medium/low counts, and **interactive colored clause heatmap**. |
| 🔄 **Contract Comparator** | Side-by-side discrepancy audit of original vs. revised markup drafts. | **Variance Matrix Table**, favorability winner by clause, and negotiation leverage recommendations. |
| ❓ **Legal Q&A** | Answers document-specific questions grounded strictly in provided text. | Direct cited answers with relevant clause snippets and excerpt citations. |
| ✅ **Action Checklist** | Formulates role-tailored pre-signing review & negotiation checklists. | Phase-by-phase checklist with deal-breakers, red flags, and attorney talking points. |

---

## 👥 Use Cases & Buyer Personas

- 🎓 **Pre-Law Exam Prep & Students:** Demystify dense case law, extract precedent rules, and generate study revision checklists.
- 💼 **Contract Negotiation & Founders:** Compare vendor agreements against standard baselines and spot uncapped exposure before signing.
- 🏢 **HR Compliance Teams:** Audit employment contracts, non-competes, and severance terms for statutory compliance.
- 🏠 **Real Estate Agents & Tenants:** Translate commercial triple-net (NNN) and residential leases into plain English financial commitments.
- 🧑‍💻 **Freelancers & Contractors:** Spot predatory IP assignment clauses and negotiate balanced payment terms with confidence.

---

## 🔒 Security & Privacy Architecture

- **100% Client-Side Execution:** Direct browser-to-Google communication (`generativelanguage.googleapis.com`).
- **No Hardcoded Keys:** Zero API keys stored in source code. Users validate their own key via the **First-Load Gate Modal**.
- **Local Key Storage:** API key is saved exclusively in the browser's `localStorage` and never sent to any intermediary server.
- **XSS Prevention:** All AI markdown responses and user inputs are sanitized with **DOMPurify** prior to DOM insertion.

---

## ⌨️ Keyboard Shortcuts & Polish

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Enter` / `⌘ + Enter` | Trigger AI analysis on current active tab |
| `Ctrl + K` / `⌘ + K` | Clear inputs and output on active tab |
| `🌙 / ☀️ Toggle` | Switch between Dark Mode and Light Mode |
| `📋 Copy` | Copy analysis report or recommended counter-term |
| `📥 Export PDF` | Download branded report with timestamp and Gemini 3.6 Flash watermark |

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser (Zero Build Step)
1. Double-click [index.html](file:///c:/Users/seren/.gemini/antigravity-ide/scratch/legal-assistant-antigravity/index.html) or [legal-assistant.html](file:///c:/Users/seren/.gemini/antigravity-ide/scratch/legal-assistant-antigravity/legal-assistant.html) in any modern browser.
2. Enter your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Click **📂 Sample Contracts** in the top header to load demo contracts instantly.

### Option 2: Run with Local Dev Server
```bash
# Clone the repository
git clone https://github.com/arjunpv1312/legal-assistant-antigravity.git
cd legal-assistant-antigravity

# Start local server
npm start
# App will be accessible at http://localhost:8000
```

---

## 💻 Tech Stack & Dependencies

- **AI Model:** Google Gemini 3.6 Flash (`models/gemini-3.6-flash`)
- **Frontend Framework:** HTML5, Tailwind CSS CDN (with Dark Mode support), Vanilla JavaScript ES6+
- **PDF Engine:** [PDF.js v3.11](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js) (PDF ingestion & text extraction)
- **PDF Export:** [html2pdf.js v0.10](https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js) (Client-side report generation)
- **Markdown & Security:** [Marked.js](https://cdnjs.cloudflare.com/ajax/libs/marked/11.1.0/marked.min.js) & [DOMPurify](https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.8/purify.min.js)
- **Deployment:** Vercel & GitHub Pages compatible

---

## 🧪 Testing Checklist

- [x] **API Key Gate Modal:** App triggers validation gate modal on first load if no key is stored.
- [x] **Live Pre-Flight Validation:** Rejects invalid/expired keys with clear error messages.
- [x] **429 Rate Limit Handling:** Displays automatic countdown timer modal (`5s... 4s... 3s...`) and retries seamlessly.
- [x] **Document Simplifier:** Translates NDA / SaaS / Lease / Contractor agreements into plain English.
- [x] **Risk Scorecard & Heatmap:** Interactive colored clause tags with counter-proposals.
- [x] **Side-by-Side Comparator:** Highlights variance matrix between Document A and Document B.
- [x] **Document Q&A:** Answers user queries with direct text citations.
- [x] **Action Checklist:** Generates categorized negotiation checklists by role.
- [x] **PDF Drag-and-Drop:** Extracts text from uploaded PDF documents across all 5 tools.
- [x] **Export to PDF:** Downloads clean, formatted PDF reports with timestamp and branding.
- [x] **Dark Mode Toggle:** Smooth theme switching with persistent user preference.
- [x] **History Drawer:** Stores last 5 analyses in `localStorage` with individual delete (`🗑️`) support.

---

## ⚖️ Legal Disclaimer

*Legal Assistant Pro provides AI-assisted document analysis for research and educational purposes only. It does not constitute formal legal counsel or establish an attorney-client relationship. Always consult a licensed attorney for binding legal decisions.*

---

## 🎓 Author & Submission Info

- **Challenge:** AI for Legal Assistance & Access (PromptWars Challenge 5)
- **Built with:** Google Antigravity & Google Gemini 3.6 Flash
- **Author:** Arjun (Google Gemini Student Ambassador 2026)
- **GitHub:** [@arjunpv1312](https://github.com/arjunpv1312)
- **Repository:** [legal-assistant-antigravity](https://github.com/arjunpv1312/legal-assistant-antigravity)
- **License:** MIT License — See [LICENSE](LICENSE)
