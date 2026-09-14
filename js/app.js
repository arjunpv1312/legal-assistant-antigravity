// Legal Assistant Pro — Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  initTabs();
  initSettingsModal();
  initSampleDropdown();
  initFileUploads();
  initCharacterCounters();
  initToolActionListeners();
  initExportAndCopyListeners();
  initQuickQuestionChips();
}

/**
 * Toast Notification System
 */
function showToast(message, icon = 'ℹ️', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Tab Navigation
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600');
        b.classList.add('text-slate-600');
      });

      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600');
      btn.classList.remove('text-slate-600');

      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      localStorage.setItem('legal_pro_active_tab', tabId);
    });
  });

  const savedTab = localStorage.getItem('legal_pro_active_tab') || 'simplify';
  const initialBtn = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
  if (initialBtn) initialBtn.click();
}

/**
 * Settings & API Key Configuration Modal
 */
function initSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('settings-modal-btn');
  const closeBtn = document.getElementById('settings-close-btn');
  const cancelBtn = document.getElementById('settings-cancel-btn');
  const saveBtn = document.getElementById('settings-save-btn');
  const keyInput = document.getElementById('custom-api-key-input');
  const statusLabel = document.getElementById('api-status-label');

  function updateStatusLabel() {
    const key = window.geminiService.getStoredApiKey();
    if (key) {
      statusLabel.textContent = 'API Key Configured';
      openBtn.classList.remove('bg-blue-50', 'text-blue-700', 'border-blue-200');
      openBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
    } else {
      statusLabel.textContent = 'API Settings';
      openBtn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
      openBtn.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200');
    }
  }

  updateStatusLabel();

  openBtn.addEventListener('click', () => {
    keyInput.value = window.geminiService.getStoredApiKey();
    modal.classList.remove('hidden');
  });

  const closeModal = () => modal.classList.add('hidden');
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  saveBtn.addEventListener('click', () => {
    const val = keyInput.value.trim();
    window.geminiService.setStoredApiKey(val);
    updateStatusLabel();
    closeModal();
    showToast(val ? 'Gemini API Key saved successfully!' : 'API Key cleared. Using server proxy.', '🔑');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * Sample Document Dropdown Loader
 */
function initSampleDropdown() {
  const btn = document.getElementById('sample-docs-btn');
  const menu = document.getElementById('sample-docs-menu');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    if (!menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
    }
  });

  menu.querySelectorAll('[data-sample]').forEach(item => {
    item.addEventListener('click', () => {
      const sampleKey = item.dataset.sample;
      const sampleData = window.SAMPLE_CONTRACTS?.[sampleKey];

      if (!sampleData) return;

      // Identify active tab input
      const activeTabEl = document.querySelector('.tab-content.active');
      if (!activeTabEl) return;

      const activeTabId = activeTabEl.id;
      let targetInput = null;

      if (activeTabId === 'simplify') targetInput = document.getElementById('simplify-input');
      else if (activeTabId === 'analyze') targetInput = document.getElementById('analyze-input');
      else if (activeTabId === 'compare') {
        document.getElementById('compare-doc1').value = window.SAMPLE_CONTRACTS.nda.text;
        document.getElementById('compare-doc2').value = window.SAMPLE_CONTRACTS.saas.text;
        showToast('Loaded Contract 1 (NDA) & Contract 2 (SaaS) for comparison', '📂');
        menu.classList.add('hidden');
        return;
      }
      else if (activeTabId === 'qa') targetInput = document.getElementById('qa-context');
      else if (activeTabId === 'checklist') targetInput = document.getElementById('checklist-input');

      if (targetInput) {
        targetInput.value = sampleData.text;
        targetInput.dispatchEvent(new Event('input'));
        showToast(`Loaded sample: ${sampleData.title}`, '📂');
      }

      menu.classList.add('hidden');
    });
  });
}

/**
 * PDF / DOCX Universal File Upload Listeners
 */
function initFileUploads() {
  document.querySelectorAll('.file-upload-input').forEach(input => {
    input.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const targetId = input.dataset.target;
      const targetEl = document.getElementById(targetId);
      const activeTab = document.querySelector('.tab-content.active')?.id || 'simplify';
      const progressEl = document.getElementById(`${activeTab}-upload-progress`);
      const statusText = progressEl?.querySelector('.upload-status-text');

      if (progressEl) progressEl.classList.remove('hidden');

      try {
        const text = await window.pdfHandler.extractTextFromFile(file, (pageNum, total) => {
          if (statusText) statusText.textContent = `Extracting page ${pageNum} of ${total}...`;
        });

        if (targetEl) {
          targetEl.value = text;
          targetEl.dispatchEvent(new Event('input'));
          showToast(`Successfully extracted ${file.name} (${text.length} chars)`, '📄');
        }
      } catch (err) {
        console.error('File parsing error:', err);
        showToast(err.message || 'Failed to read document', '❌', 4000);
      } finally {
        if (progressEl) progressEl.classList.add('hidden');
        input.value = ''; // Reset for re-selection
      }
    });
  });
}

/**
 * Real-Time Character Counters
 */
function initCharacterCounters() {
  const pairs = [
    { input: 'simplify-input', counter: 'simplify-char-count' },
    { input: 'analyze-input', counter: 'analyze-char-count' }
  ];

  pairs.forEach(({ input, counter }) => {
    const inputEl = document.getElementById(input);
    const counterEl = document.getElementById(counter);
    if (!inputEl || !counterEl) return;

    inputEl.addEventListener('input', () => {
      const len = inputEl.value.length;
      counterEl.textContent = `${len.toLocaleString()} characters`;
    });
  });
}

/**
 * Quick Question Chips in Q&A Tab
 */
function initQuickQuestionChips() {
  document.querySelectorAll('.qa-quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const questionInput = document.getElementById('qa-question');
      if (questionInput) {
        questionInput.value = chip.textContent.trim();
        questionInput.focus();
      }
    });
  });
}

/**
 * Core Tool Action Handlers (Gemini Calls)
 */
function initToolActionListeners() {
  // 1. SIMPLIFY TOOL
  const simplifyBtn = document.getElementById('simplify-btn');
  const simplifyClear = document.getElementById('simplify-clear');
  const simplifyInput = document.getElementById('simplify-input');
  const simplifyOutputWrapper = document.getElementById('simplify-output-wrapper');
  const simplifyOutput = document.getElementById('simplify-output');

  simplifyBtn?.addEventListener('click', async () => {
    const text = simplifyInput.value.trim();
    if (!text) {
      showToast('Please paste a document or upload a PDF first.', '⚠️');
      return;
    }

    setButtonLoading(simplifyBtn, true, 'Simplifying...');
    simplifyOutputWrapper.classList.remove('hidden');
    simplifyOutput.innerHTML = buildLoadingSkeleton('Translating complex legal language into plain English...');

    const prompt = `You are an elite legal simplifier and plain-English contract translator.
Analyze and simplify the following legal document into plain, accessible, crystal-clear English.

STRUCTURE YOUR OUTPUT CLEARLY AS FOLLOWS:
# 📄 Plain-English Executive Summary
(2-3 clear paragraphs explaining what this agreement is, who the parties are, and its primary purpose)

## 🔑 Key Rights & Benefits
(Bullet points of what each party gains or is entitled to do)

## ⚠️ Core Obligations & Restrictions
(Clear bullet points of what must or must not be done, deadlines, and strict rules)

## 💰 Financial & Payment Terms
(Compensation, invoicing, penalties, interest, and monetary conditions)

## ⏳ Duration, Renewal & Termination
(How long it lasts, auto-renewals, notice periods, and how either party can cancel)

## 🛑 What Happens If Something Goes Wrong (Disputes & Liabilities)
(Indemnity, liability limits, and dispute resolution venues)

DOCUMENT TEXT:
${text}`;

    try {
      const result = await window.geminiService.generate({
        prompt,
        systemInstruction: 'You are an elite legal assistant dedicated to translating dense legalese into actionable, plain-English summaries.'
      });

      simplifyOutput.innerHTML = window.marked.parse(result);
      showToast('Document simplified successfully!', '✨');
    } catch (err) {
      simplifyOutput.innerHTML = buildErrorBanner(err.message);
    } finally {
      setButtonLoading(simplifyBtn, false, '<span>🚀</span> Simplify Document');
    }
  });

  simplifyClear?.addEventListener('click', () => {
    simplifyInput.value = '';
    simplifyOutputWrapper.classList.add('hidden');
    simplifyOutput.innerHTML = '';
    document.getElementById('simplify-char-count').textContent = '0 characters';
  });

  // 2. RISK AUDIT & INLINE CLAUSE HIGHLIGHTER
  const analyzeBtn = document.getElementById('analyze-btn');
  const analyzeClear = document.getElementById('analyze-clear');
  const analyzeInput = document.getElementById('analyze-input');
  const analyzeOutputWrapper = document.getElementById('analyze-output-wrapper');
  const analyzeOutput = document.getElementById('analyze-output');

  analyzeBtn?.addEventListener('click', async () => {
    const text = analyzeInput.value.trim();
    if (!text) {
      showToast('Please paste a contract or upload a PDF for risk audit.', '⚠️');
      return;
    }

    setButtonLoading(analyzeBtn, true, 'Auditing Risks & Clauses...');
    analyzeOutputWrapper.classList.remove('hidden');
    analyzeOutput.innerHTML = buildLoadingSkeleton('Scanning clauses for liability hazards and ambiguous terms...');

    try {
      const data = await window.geminiService.analyzeRisksWithClauses(text);

      // 1. Update Scorecard
      const score = data.riskScore || 65;
      const scoreEl = document.getElementById('risk-score-badge');
      scoreEl.textContent = `${score}/100`;
      scoreEl.className = `text-2xl font-extrabold ${score > 70 ? 'text-red-600' : score > 40 ? 'text-amber-600' : 'text-emerald-600'}`;

      document.getElementById('risk-summary-text').textContent = data.riskSummary || 'Risk audit completed.';

      // 2. Update Counters
      const highCount = data.clauses?.filter(c => c.riskLevel === 'HIGH').length || data.highRiskCount || 0;
      const medCount = data.clauses?.filter(c => c.riskLevel === 'MEDIUM').length || data.mediumRiskCount || 0;
      const lowCount = data.clauses?.filter(c => c.riskLevel === 'LOW').length || data.lowRiskCount || 0;

      document.getElementById('counter-high-risk').textContent = highCount;
      document.getElementById('counter-med-risk').textContent = medCount;
      document.getElementById('counter-low-risk').textContent = lowCount;

      // 3. Render Interactive Clause Highlighter Heatmap
      window.clauseHighlighter.render({
        originalText: text,
        clauses: data.clauses || [],
        targetContainerId: 'clause-highlighter-container'
      });

      // 4. Render Markdown breakdown
      if (data.markdownReport) {
        analyzeOutput.innerHTML = window.marked.parse(data.markdownReport);
      } else {
        analyzeOutput.innerHTML = `<p class="text-slate-600 text-sm">Interactive clause inspection completed above. Click any clause highlight to inspect counter-proposals.</p>`;
      }

      showToast(`Risk audit complete: ${highCount} high risks identified`, highCount > 0 ? '⚠️' : '✅');
    } catch (err) {
      analyzeOutput.innerHTML = buildErrorBanner(err.message);
    } finally {
      setButtonLoading(analyzeBtn, false, '<span>⚠️</span> Audit Risks & Highlight Clauses');
    }
  });

  analyzeClear?.addEventListener('click', () => {
    analyzeInput.value = '';
    analyzeOutputWrapper.classList.add('hidden');
    analyzeOutput.innerHTML = '';
    document.getElementById('analyze-char-count').textContent = '0 characters';
    document.getElementById('clause-highlighter-container').innerHTML = '';
  });

  // 3. COMPARE TOOL
  const compareBtn = document.getElementById('compare-btn');
  const compareClear = document.getElementById('compare-clear');
  const doc1 = document.getElementById('compare-doc1');
  const doc2 = document.getElementById('compare-doc2');
  const compareOutputWrapper = document.getElementById('compare-output-wrapper');
  const compareOutput = document.getElementById('compare-output');

  compareBtn?.addEventListener('click', async () => {
    const text1 = doc1.value.trim();
    const text2 = doc2.value.trim();

    if (!text1 || !text2) {
      showToast('Please paste both contracts to run side-by-side comparison.', '⚠️');
      return;
    }

    setButtonLoading(compareBtn, true, 'Comparing Contracts...');
    compareOutputWrapper.classList.remove('hidden');
    compareOutput.innerHTML = buildLoadingSkeleton('Comparing contract clauses, liabilities, and discrepancies...');

    const prompt = `You are an elite legal contract comparison and negotiation auditor.
Compare the following two contracts (Contract A vs Contract B) and provide a comprehensive variance analysis.

STRUCTURE YOUR OUTPUT AS:
# 🔄 Contract Variance & Comparison Matrix

## 📊 Executive Summary of Key Differences
(Concise summary of how the contracts diverge in obligations, tone, and favorability)

## ⚖️ Clause-by-Clause Comparison Table
| Topic / Clause | Contract A (Original) | Contract B (Proposed) | Assessment & Winner |
| :--- | :--- | :--- | :--- |
(Include Rows for: Scope, Payment & Penalties, IP Rights, Liability Caps, Indemnity, Termination & Notice, Governing Law)

## 🟢 Where Contract A is More Favorable
(Specific clauses giving advantage to Contract A party)

## 🔵 Where Contract B is More Favorable
(Specific clauses giving advantage to Contract B party)

## 🚨 Critical Red Flags & Unfavorable Shifts
(Alerts on hidden risks introduced in Contract B)

## 💡 Recommended Negotiation Stance
(Strategic advice on which provisions to accept, counter, or reject)

CONTRACT A:
${text1}

CONTRACT B:
${text2}`;

    try {
      const result = await window.geminiService.generate({
        prompt,
        systemInstruction: 'You are an elite legal contract comparison specialist.'
      });

      compareOutput.innerHTML = window.marked.parse(result);
      showToast('Comparison completed!', '📊');
    } catch (err) {
      compareOutput.innerHTML = buildErrorBanner(err.message);
    } finally {
      setButtonLoading(compareBtn, false, '<span>🔍</span> Compare Contracts');
    }
  });

  compareClear?.addEventListener('click', () => {
    doc1.value = '';
    doc2.value = '';
    compareOutputWrapper.classList.add('hidden');
    compareOutput.innerHTML = '';
  });

  // 4. Q&A TOOL
  const qaBtn = document.getElementById('qa-btn');
  const qaClear = document.getElementById('qa-clear');
  const qaContext = document.getElementById('qa-context');
  const qaQuestion = document.getElementById('qa-question');
  const qaOutputWrapper = document.getElementById('qa-output-wrapper');
  const qaOutput = document.getElementById('qa-output');

  qaBtn?.addEventListener('click', async () => {
    const context = qaContext.value.trim();
    const question = qaQuestion.value.trim();

    if (!context || !question) {
      showToast('Please provide both document context and a specific question.', '⚠️');
      return;
    }

    setButtonLoading(qaBtn, true, 'Finding Answer...');
    qaOutputWrapper.classList.remove('hidden');
    qaOutput.innerHTML = buildLoadingSkeleton(`Analyzing context to answer: "${question}"...`);

    const prompt = `You are an AI Legal Research Counsel.
Based strictly on the provided legal document, answer the user's specific legal question.

QUESTION:
${question}

DOCUMENT CONTEXT:
${context}

STRUCTURE YOUR RESPONSE AS:
### 📌 Direct Answer
(Concise, direct answer in 1-2 plain sentences)

### 📜 Relevant Contract Excerpts & Citations
(Exact quotes from the document supporting this answer)

### ⚖️ Legal Nuance & Practical Impact
(What this means for rights, enforcement, and exposure)

### 💡 Suggested Action or Next Steps
(Practical recommendation if reviewing or negotiating this term)`;

    try {
      const result = await window.geminiService.generate({
        prompt,
        systemInstruction: 'You are an accurate, cited AI Legal Counsel.'
      });

      qaOutput.innerHTML = window.marked.parse(result);
      showToast('Answer retrieved!', '💡');
    } catch (err) {
      qaOutput.innerHTML = buildErrorBanner(err.message);
    } finally {
      setButtonLoading(qaBtn, false, '<span>🤔</span> Get Legal Answer');
    }
  });

  qaClear?.addEventListener('click', () => {
    qaContext.value = '';
    qaQuestion.value = '';
    qaOutputWrapper.classList.add('hidden');
    qaOutput.innerHTML = '';
  });

  // 5. ACTION CHECKLIST TOOL
  const checklistBtn = document.getElementById('checklist-btn');
  const checklistClear = document.getElementById('checklist-clear');
  const checklistType = document.getElementById('checklist-type');
  const checklistRole = document.getElementById('checklist-role');
  const checklistInput = document.getElementById('checklist-input');
  const checklistOutputWrapper = document.getElementById('checklist-output-wrapper');
  const checklistOutput = document.getElementById('checklist-output');

  checklistBtn?.addEventListener('click', async () => {
    const text = checklistInput.value.trim();
    if (!text) {
      showToast('Please paste a document or upload a PDF first.', '⚠️');
      return;
    }

    const type = checklistType.value;
    const role = checklistRole.value;

    setButtonLoading(checklistBtn, true, 'Generating Checklist...');
    checklistOutputWrapper.classList.remove('hidden');
    checklistOutput.innerHTML = buildLoadingSkeleton(`Formulating actionable negotiation checklist for ${type}...`);

    const prompt = `You are a strategic legal advisor creating an actionable negotiation and review checklist for a ${type}.
Review the document from the perspective of: ${role}.

Generate an organized, practical checklist with specific items to verify, negotiate, and ask legal counsel.

FORMAT WITH SECTIONS:
### 📋 Phase 1: Essential Pre-Signing Verification
- [ ] Item 1
- [ ] Item 2

### 🚨 Phase 2: High-Priority Red Flags & Deal Breakers
- [ ] Item 1
- [ ] Item 2

### 💬 Phase 3: Targeted Questions for Your Attorney
- [ ] Item 1
- [ ] Item 2

### ✍️ Phase 4: Negotiation Counter-Terms to Request
- [ ] Item 1
- [ ] Item 2

DOCUMENT TEXT:
${text}`;

    try {
      const result = await window.geminiService.generate({
        prompt,
        systemInstruction: 'You are an expert contract negotiation strategist.'
      });

      // Render interactive checklist
      renderInteractiveChecklist(result, checklistOutput);
      showToast('Checklist generated successfully!', '✅');
    } catch (err) {
      checklistOutput.innerHTML = buildErrorBanner(err.message);
    } finally {
      setButtonLoading(checklistBtn, false, '<span>✅</span> Generate Action Checklist');
    }
  });

  checklistClear?.addEventListener('click', () => {
    checklistInput.value = '';
    checklistOutputWrapper.classList.add('hidden');
    checklistOutput.innerHTML = '';
  });
}

/**
 * Renders interactive checklist cards with real HTML checkboxes
 */
function renderInteractiveChecklist(markdownText, container) {
  const sections = markdownText.split(/(?=###\s+)/);
  let html = '';

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    if (!lines[0]) return;

    const title = lines[0].replace(/###\s*/, '').trim();
    const isRedFlag = title.toLowerCase().includes('red flag') || title.includes('🚨');
    const isAttorney = title.toLowerCase().includes('attorney') || title.includes('💬');

    const cardClass = isRedFlag
      ? 'bg-red-50/70 border-red-200 text-red-950'
      : isAttorney
      ? 'bg-blue-50/70 border-blue-200 text-blue-950'
      : 'bg-slate-50 border-slate-200 text-slate-900';

    html += `
      <div class="p-5 rounded-xl border ${cardClass} space-y-3">
        <h4 class="font-bold text-base flex items-center gap-2">${title}</h4>
        <div class="space-y-2">
    `;

    lines.slice(1).forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]') || trimmed.startsWith('- ')) {
        const itemText = trimmed.replace(/^-\s*(\[[ xX]\])?\s*/, '');
        html += `
          <label class="flex items-start gap-3 p-2 rounded-lg hover:bg-white/60 transition cursor-pointer text-sm">
            <input type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
            <span class="leading-snug">${window.clauseHighlighter.escapeHtml(itemText)}</span>
          </label>
        `;
      } else if (trimmed) {
        html += `<p class="text-xs opacity-75">${window.clauseHighlighter.escapeHtml(trimmed)}</p>`;
      }
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html || window.marked.parse(markdownText);
}

/**
 * Universal Export to PDF and Copy Buttons
 */
function initExportAndCopyListeners() {
  // Copy Buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sourceId = btn.dataset.source;
      const sourceEl = document.getElementById(sourceId);
      if (!sourceEl) return;

      const text = sourceEl.innerText || sourceEl.textContent;
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', '📋');
    });
  });

  // Export PDF Buttons
  document.querySelectorAll('.export-pdf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sourceId = btn.dataset.source;
      const title = btn.dataset.title || 'Legal Analysis Report';

      showToast('Generating high-resolution PDF report...', '⏳');
      window.pdfHandler.exportToPDF({
        title: title,
        contentElementId: sourceId
      });
    });
  });
}

/**
 * UI Helpers: Skeletons & Spinners
 */
function setButtonLoading(btn, isLoading, originalHtml) {
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> ${originalHtml}`;
    btn.classList.add('opacity-80', 'cursor-not-allowed');
  } else {
    btn.disabled = false;
    btn.innerHTML = originalHtml || btn.dataset.original;
    btn.classList.remove('opacity-80', 'cursor-not-allowed');
  }
}

function buildLoadingSkeleton(message = 'Analyzing document...') {
  return `
    <div class="py-12 flex flex-col items-center justify-center text-center space-y-4">
      <div class="relative flex items-center justify-center">
        <div class="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span class="absolute text-xl">⚖️</span>
      </div>
      <div>
        <h4 class="font-bold text-slate-800 text-base">${message}</h4>
        <p class="text-xs text-slate-400 mt-1">Applying legal intelligence models via Gemini 2.0 Flash...</p>
      </div>
    </div>
  `;
}

function buildErrorBanner(errorMessage) {
  return `
    <div class="p-5 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-2">
      <div class="flex items-center gap-2 font-bold text-base text-red-900">
        <span>⚠️</span> Legal Analysis Error
      </div>
      <p class="text-xs leading-relaxed font-mono bg-red-100/50 p-3 rounded-lg border border-red-200">${errorMessage}</p>
      <p class="text-xs text-red-700">
        Tip: If this is an API Key error, click the ⚙️ Settings button in the header to configure your Gemini API Key.
      </p>
    </div>
  `;
}
