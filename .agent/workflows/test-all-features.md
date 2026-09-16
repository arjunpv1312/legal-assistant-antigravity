# Complete Feature Test Suite Workflow

This workflow executes automated integration and output-validation tests for all 5 core legal tools in **Legal Assistant Pro** powered by **Google Gemini 3.6 Flash**.

---

## 🧪 Test Matrix

| # | Feature / Tool | Test Input | Expected Behavior & Assertions |
|---|---|---|---|
| **1** | **Document Simplifier** | `"The licensor may terminate this license upon 30 days written notice."` | Returns plain-English breakdown with summary, termination rights, and notice period. |
| **2** | **Contract Comparator** | **Doc A:** `"Liability: Unlimited"`<br>**Doc B:** `"Liability: Limited to $100,000"` | Highlights clear variance, identifies Contract B as more favorable on liability. |
| **3** | **Risk & Clause Audit** | `"All rights reserved. No refunds under any circumstance."` | Returns structured risk analysis identifying at least 1 **HIGH-RISK** clause (no refund / strict forfeiture). |
| **4** | **Contextual Q&A** | **Doc:** `"Payment due within 30 days of invoice date."`<br>**Q:** `"When is payment due?"` | Returns direct cited answer containing `"30 days"`. |
| **5** | **Action Checklist** | **Type:** `"Service Agreement"`<br>**Doc:** Standard service terms | Generates structured checkbox list (`- [ ]`), red flags, and attorney talking points. |

---

## ⚡ Automated Test Script

Run the automated test runner locally:

```bash
npm test
# or: node scripts/test-all-features.js
```

### Script Execution Logic:
For each tool test, the test runner:
1. Validates non-empty input payload.
2. Sends the request with exponential backoff handling to `gemini-3.6-flash`.
3. Checks for API errors, HTTP 429/500, or empty responses.
4. Asserts expected keywords and structural outputs (markdown headers, JSON structure, checklist format).
5. Logs test timing, status (`PASS` / `FAIL`), and output summary.

---

## 📝 Manual Verification Checklist (Browser UI)

1. Open `index.html` or `legal-assistant.html` in browser.
2. Connect your API key in the first-load gate modal.
3. Navigate to each tab and run the respective test inputs or sample contracts.
4. Verify interactive rendering (dark mode toggle, copy button toast, inline clause tags, and PDF download).
