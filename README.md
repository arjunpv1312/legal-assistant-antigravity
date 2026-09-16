# ⚖️ Legal Assistant Pro — Understand. Compare. Navigate.

[![Gemini](https://img.shields.io/badge/AI_Engine-Google_Gemini_3.6_Flash-blue?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![PromptWars](https://img.shields.io/badge/Challenge-PromptWars_5:_Legal_AI-indigo?style=for-the-badge)](https://github.com/arjunpv1312/legal-assistant-antigravity)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-success?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Single File App](https://img.shields.io/badge/Architecture-Single--File_Static_HTML5-orange?style=for-the-badge)](#-tech-stack)

> **All-in-One GenAI Legal Intelligence Platform** built for **PromptWars Challenge 5: AI for Legal Assistance & Access**.  
> Simplifies dense legalese into plain English, audits contracts for punitive liabilities with visual heatmaps, compares agreement drafts side-by-side, provides cited legal Q&A, and generates actionable pre-signing negotiation checklists with full **WCAG 2.1 AA Accessibility**.

---

## 🎯 The Problem
Legal documents are deliberately engineered for lawyers, not ordinary people. Every day, freelancers, startup founders, consumers, and students sign agreements packed with:
- **Uncapped indemnities & perpetual survival clauses**
- **Hidden auto-renewals with strict penalty windows**
- **Broad IP work-for-hire assignment traps**
- **One-sided limitation-of-liability waivers**

Professional legal review costs upwards of **$400–$800/hour**, leaving over **80% of individuals and small businesses unprotected**.

---

## 🌍 Impact
Legal documents exclude non-lawyers. Our solution:
- 📄 **Simplify:** Jargon → plain English (accessibility)
- 🔄 **Compare:** Multiple contracts → clear differences (informed decisions)
- ⚠️ **Risk:** Red flags highlighted → avoid costly mistakes
- ❓ **Q&A:** Specific answers → confidence in understanding
- ✅ **Checklist:** Action plan → ready for lawyer consultation

**Result:** Legal literacy for everyone. Reduces anxiety. Enables informed consent.

---

## ✨ The Solution: 5 AI Legal Tools in 1 Interface

Legal Assistant Pro puts an elite, instantaneous legal analyst directly into your browser:

```
+-----------------------------------------------------------------------------------+
|                            ⚖️ LEGAL ASSISTANT PRO                                 |
+-----------------------------------------------------------------------------------+
|  [📄 Document Simplifier]  [⚠️ Risk Audit]  [🔄 Comparator]  [❓ Q&A]  [✅ Checklist] |
+-----------------------------------------------------------------------------------+
|  • Full WCAG 2.1 AA Compliance (ARIA, Screen Readers, High Contrast, Focus Ring)  |
|  • Ultra-Fast 15s Timeout, AbortController & In-Memory Response Caching           |
|  • Client-Side Drag & Drop PDF Ingestion (PDF.js) & Branded PDF Export (html2pdf)  |
|  • Powered by Google Gemini 3.6 Flash with Exponential Backoff Resilience          |
|  • Client-Side Gate Modal (Zero Hardcoded Keys - BYOK Security Architecture)       |
|  • Interactive Clause Heatmap with 1-Click Counter-Proposals                      |
|  • Dark / Light Theme & Keyboard Shortcuts (Ctrl+Enter, Esc, Ctrl+K, Shift+?)     |
+-----------------------------------------------------------------------------------+
```

### 🛠️ Core Capabilities

| Tool | Purpose | Key Output & Features |
| :--- | :--- | :--- |
| 📄 **Document Simplifier** | Converts dense legal jargon into crystal-clear plain English. | Structured breakdown of Rights, Obligations, Financial Penalties, and Termination Windows. |
| ⚠️ **Risk & Clause Audit** | Detects hidden liabilities, one-sided covenants, and unfair terms. | **Executive Risk Score (0-100)**, high/medium/low counts, and **interactive colored clause heatmap**. |
| 🔄 **Contract Comparator** | Side-by-side discrepancy audit of original vs. revised markup drafts. | **Variance Matrix Table**, favorability winner by clause, and negotiation leverage recommendations. |
| ❓ **Legal Q&A** | Answers document-specific questions grounded strictly in provided text. | Direct cited answers with relevant clause snippets and excerpt citations. |
| ✅ **Action Checklist** | Formulates role-tailored pre-signing review & negotiation checklists. | Phase-by-phase checklist with deal-breakers, red flags, and attorney talking points. |

---

## ♿ Accessibility & Universal Design (WCAG 2.1 AA)

Legal Assistant Pro is engineered to achieve **100/100 Accessibility** compliance under WCAG 2.1 AA:

1. **ARIA Roles & Semantics:** Full `role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="region"`, `role="alert"`, and descriptive `aria-label` attributes on every interactive element.
2. **Screen Reader Live Updates:** `aria-live="polite"` dynamic announcement regions for AI outputs and loading progress timers.
3. **Keyboard-First Navigation:**
   - Full keyboard focusability with visible 2px focus ring (`:focus-visible`).
   - WAI-ARIA arrow key navigation across tab bars.
   - `Ctrl+Enter` / `⌘+Enter` to submit active analysis.
   - `Esc` to clear inputs or dismiss modals.
   - `Ctrl+K` to open API key settings.
   - `Shift+?` to trigger contextual help tooltips.
4. **Color Contrast & Dual Indicators:** All risk tags use text labels + icons (🚨 High, ⚠️ Medium, ✅ Low) and exceed WCAG AA contrast ratio (≥ 4.5:1).
5. **Mobile Accessibility:** All interactive elements feature touch targets ≥ 44x44px with responsive typography (≥ 16px base font) preventing zoom distortion.
6. **Skip to Main Content:** Accessible hidden skip link for direct navigation bypass.

---

## ⚡ Performance & Resilience Architecture

- **15-Second Timeout & Abort:** Every API request is monitored by a 15-second timer. If Gemini takes longer or network lags, a retry banner appears with a cancel button to prevent browser hangs.
- **Instant Abort on Tab Switch:** Switching tabs mid-generation cleanly aborts in-flight network requests using `AbortController`.
- **In-Memory Query Cache:** Repeated analysis requests for the same text return instantly (`⚡ Cached (0.0s)`), conserving token quotas.
- **Intelligent Truncation for Long Documents:** Documents exceeding 3,000 characters display a clear truncation status notice and analyze the initial 3,000 characters for sub-second responsiveness.

---

## 👥 Use Cases & Buyer Personas

- 🎓 **Pre-Law Students & Researchers:** Demystify dense case law, extract precedent rules, and generate study revision checklists.
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

## ⌨️ Keyboard Shortcuts & Controls

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Enter` / `⌘ + Enter` | Trigger AI analysis on current active tab |
| `Esc` | Clear inputs or close open modals |
| `Ctrl + K` / `⌘ + K` | Open Gemini API Key Settings modal |
| `Shift + ?` | View contextual help tooltip for active tool |
| `← / → Arrow Keys` | Navigate between tabs |
| `🌙 / ☀️ Toggle` | Switch between Dark Mode and Light Mode |
| `📋 Copy` | Copy analysis report or recommended counter-term |
| `📥 Export PDF` | Download branded report with timestamp and Gemini 3.6 Flash watermark |

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser (Zero Build Step)
1. Double-click [index.html](index.html) or [legal-assistant.html](legal-assistant.html) in any modern browser.
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
- **Accessibility:** WCAG 2.1 AA Compliant with WAI-ARIA 1.2 Patterns
- **PDF Engine:** [PDF.js v3.11](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js) (Client-side PDF text extraction)
- **PDF Export:** [html2pdf.js v0.10](https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js) (Client-side report generation)
- **Markdown & Security:** [Marked.js](https://cdnjs.cloudflare.com/ajax/libs/marked/11.1.0/marked.min.js) & [DOMPurify](https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.8/purify.min.js)
- **Deployment:** Vercel & GitHub Pages compatible

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
