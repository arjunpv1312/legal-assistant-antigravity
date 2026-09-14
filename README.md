# Legal Assistant Pro — PromptWars Challenge 5

An AI-powered legal assistance platform that simplifies complex legal documents, compares contracts, highlights risks, answers document-specific questions, and generates actionable checklists.

## 🎯 Problem
Legal documents are designed for lawyers, not people. Most can't parse contracts or spot risks without expensive professional help.

## ✨ Solution
Legal Assistant Pro is a 5-tool GenAI platform that makes legal information accessible to everyone.

### Features
- 📄 **Document Simplifier** — Convert legal jargon to plain English
- 🔄 **Contract Comparison** — Side-by-side analysis of multiple agreements
- ⚠️ **Risk Analyzer** — Identify HIGH/MEDIUM/LOW risk clauses automatically
- ❓ **Document Q&A** — Ask specific questions about any legal document
- ✅ **Action Checklist** — Generate preparation steps for lawyer meetings or negotiations
- 📤 **PDF Upload** — Drag-and-drop PDF documents for instant analysis
- 💾 **Export to PDF** — Download risk analysis and checklists as PDFs
- 🔍 **Inline Clause Highlighting** — Compare contracts with highlighted differences
- 📚 **Analysis History** — localStorage saves last 5 document analyses
- 🔑 **Custom API Key** — Use your own Gemini API key if demo key fails

## 🚀 Quick Start

1. Open `legal-assistant.html` in any modern browser
2. Paste your legal document into a tab
3. Choose your analysis type
4. Get instant AI-powered insights

## 💻 Tech Stack
- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **AI Engine:** Google Gemini 2.0 Flash API
- **Resilience:** Exponential backoff retry logic (handles 429 rate limits)
- **Hosting:** Vercel

## 🧪 Local Testing

**Prerequisites:**
- Modern browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key (free from aistudio.google.com/app/apikey)

**Test Checklist:**
- [ ] Simplify Tab: Paste contract clause, verify plain English output
- [ ] Compare Tab: Paste two documents, verify differences highlighted
- [ ] Risk Tab: Paste contract, verify HIGH/MEDIUM/LOW risk identification
- [ ] Q&A Tab: Ask document-specific question, verify accurate answer
- [ ] Checklist Tab: Select document type, verify action items generated
- [ ] PDF Upload: Drag-drop PDF, verify text extraction works
- [ ] Export to PDF: Download checklist/analysis, verify PDF quality
- [ ] API Key: Use custom API key in settings, verify API calls work

## 📊 Submission Details

**Challenge:** AI for Legal Assistance & Access (PromptWars Challenge 5)
**Built with:** Google Antigravity (agentic IDE)
**Submission Status:** Ready for deployment

## ⚖️ Legal Disclaimer

This tool provides information and assistance, **not professional legal advice**. Always consult a licensed attorney for binding legal decisions.

## 📝 License

MIT License — See LICENSE file for details

## 🎓 Built by

Arjun (Google Gemini Student Ambassador 2026)
- GitHub: [@arjunpv1312](https://github.com/arjunpv1312)
- Email: pvarjun527@gmail.com

## 🔗 Links

- **Live Demo:** (Add Vercel URL here after deployment)
- **GitHub:** https://github.com/arjunpv1312/legal-assistant-antigravity
