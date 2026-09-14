// Interactive Inline Clause Highlighter & Risk Inspector Component

class ClauseHighlighter {
  constructor() {
    this.currentDoc = '';
    this.clauses = [];
    this.activeFilter = 'ALL';
    this.selectedClauseId = null;
  }

  /**
   * Initializes or updates the clause highlighter view in a target container
   */
  render({ originalText, clauses, targetContainerId, onClauseSelect }) {
    this.currentDoc = originalText;
    this.clauses = clauses || [];
    this.activeFilter = 'ALL';
    this.selectedClauseId = null;

    const container = document.getElementById(targetContainerId);
    if (!container) return;

    container.innerHTML = `
      <div class="clause-highlighter-wrapper border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <!-- Control Header & Filters -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔎</span>
            <h3 class="font-bold text-slate-800 text-base">Interactive Clause Inspector</h3>
            <span id="clause-total-count" class="text-xs bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
              ${this.clauses.length} Clauses Detected
            </span>
          </div>

          <!-- Risk Filters -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <button class="filter-pill active" data-filter="ALL">
              All (${this.clauses.length})
            </button>
            <button class="filter-pill filter-pill-high" data-filter="HIGH">
              🔴 High (${this.clauses.filter(c => c.riskLevel === 'HIGH').length})
            </button>
            <button class="filter-pill filter-pill-medium" data-filter="MEDIUM">
              🟡 Medium (${this.clauses.filter(c => c.riskLevel === 'MEDIUM').length})
            </button>
            <button class="filter-pill filter-pill-low" data-filter="LOW">
              🟢 Standard (${this.clauses.filter(c => c.riskLevel === 'LOW').length})
            </button>
          </div>
        </div>

        <!-- Main Layout: Document Text on Left, Inspector Panel on Right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[460px]">
          <!-- Left: Document with Inline Highlights -->
          <div class="lg:col-span-7 p-6 overflow-y-auto max-h-[580px] bg-slate-50/50 font-mono text-sm leading-relaxed text-slate-800 whitespace-pre-wrap select-text" id="highlighter-text-pane">
            ${this.buildHighlightedHTML(originalText, this.clauses)}
          </div>

          <!-- Right: Inspector Details & Suggestions -->
          <div class="lg:col-span-5 p-6 bg-white overflow-y-auto max-h-[580px]" id="highlighter-detail-pane">
            ${this.buildDefaultInspectorHTML()}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(targetContainerId, onClauseSelect);
  }

  buildHighlightedHTML(text, clauses) {
    if (!clauses || clauses.length === 0) {
      return this.escapeHtml(text);
    }

    let html = this.escapeHtml(text);

    // Sort clauses by length descending to prevent partial match collisions
    const sorted = [...clauses].sort((a, b) => (b.quote?.length || 0) - (a.quote?.length || 0));

    sorted.forEach((clause, index) => {
      const quote = clause.quote?.trim();
      if (!quote) return;

      const escapedQuote = this.escapeHtml(quote);
      const riskClass = this.getHighlightClass(clause.riskLevel);
      const badgeIcon = clause.riskLevel === 'HIGH' ? '🔴' : clause.riskLevel === 'MEDIUM' ? '🟡' : '🟢';

      const highlightSpan = `<mark class="inline-clause-mark ${riskClass}" data-clause-id="${clause.id || index}" title="Click to inspect: ${this.escapeHtml(clause.title || 'Clause')}">${badgeIcon} ${escapedQuote}</mark>`;

      // Replace first occurrence
      html = html.replace(escapedQuote, highlightSpan);
    });

    return html;
  }

  buildDefaultInspectorHTML() {
    return `
      <div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-3xl mb-3 text-blue-500">
          👆
        </div>
        <h4 class="font-semibold text-slate-700 text-base mb-1">Select Any Highlighted Clause</h4>
        <p class="text-xs text-slate-500 max-w-xs">
          Click any highlighted text on the left to inspect legal risks, business impacts, and suggested revisions.
        </p>
      </div>
    `;
  }

  buildClauseDetailHTML(clause) {
    const riskBadgeClass = {
      HIGH: 'bg-red-100 text-red-800 border-red-200',
      MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
      LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }[clause.riskLevel] || 'bg-slate-100 text-slate-800 border-slate-200';

    const riskIcon = clause.riskLevel === 'HIGH' ? '🚨' : clause.riskLevel === 'MEDIUM' ? '⚠️' : '✅';

    return `
      <div class="space-y-4 animate-fade-in">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${riskBadgeClass}">
              ${riskIcon} ${clause.riskLevel} RISK
            </span>
            <h4 class="font-bold text-slate-900 text-base mt-2">${this.escapeHtml(clause.title || 'Clause Analysis')}</h4>
            <p class="text-xs text-slate-500">${this.escapeHtml(clause.category || 'General Contract Clause')}</p>
          </div>
        </div>

        <!-- Quoted Snippet -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 italic">
          "${this.escapeHtml(clause.quote || '')}"
        </div>

        <!-- Analysis / Explanation -->
        <div class="space-y-3">
          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Why It Matters</h5>
            <p class="text-sm text-slate-700 leading-normal">${this.escapeHtml(clause.explanation || 'No details provided.')}</p>
          </div>

          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Impact & Exposure</h5>
            <p class="text-sm text-slate-700 leading-normal">${this.escapeHtml(clause.impact || 'Review with legal counsel.')}</p>
          </div>

          ${clause.recommendation ? `
            <div class="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-between mb-1">
                <h5 class="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <span>💡</span> Recommended Counter-Proposal
                </h5>
                <button class="text-xs text-blue-600 hover:text-blue-800 font-semibold copy-recommendation-btn" data-text="${this.escapeHtml(clause.recommendation)}">
                  📋 Copy
                </button>
              </div>
              <p class="text-xs text-blue-950 font-mono whitespace-pre-wrap">${this.escapeHtml(clause.recommendation)}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  attachEventListeners(containerId, onClauseSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clause mark click
    container.querySelectorAll('.inline-clause-mark').forEach(mark => {
      mark.addEventListener('click', (e) => {
        const clauseId = e.currentTarget.dataset.clauseId;
        const clause = this.clauses.find(c => String(c.id) === String(clauseId)) || this.clauses[parseInt(clauseId, 10)];

        if (clause) {
          // Highlight active mark
          container.querySelectorAll('.inline-clause-mark').forEach(m => m.classList.remove('active-mark'));
          e.currentTarget.classList.add('active-mark');

          // Render details
          const detailPane = container.querySelector('#highlighter-detail-pane');
          if (detailPane) {
            detailPane.innerHTML = this.buildClauseDetailHTML(clause);

            // Copy button listener
            const copyBtn = detailPane.querySelector('.copy-recommendation-btn');
            if (copyBtn) {
              copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(copyBtn.dataset.text);
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
              });
            }
          }

          if (onClauseSelect) onClauseSelect(clause);
        }
      });
    });

    // Filter pills
    container.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = btn.dataset.filter;
        this.activeFilter = filter;

        container.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle visibility/dimming of marks
        container.querySelectorAll('.inline-clause-mark').forEach(mark => {
          const clauseId = mark.dataset.clauseId;
          const clause = this.clauses.find(c => String(c.id) === String(clauseId)) || this.clauses[parseInt(clauseId, 10)];

          if (clause) {
            if (filter === 'ALL' || clause.riskLevel === filter) {
              mark.classList.remove('opacity-25', 'pointer-events-none');
            } else {
              mark.classList.add('opacity-25', 'pointer-events-none');
            }
          }
        });
      });
    });
  }

  getHighlightClass(riskLevel) {
    switch (riskLevel) {
      case 'HIGH': return 'clause-high';
      case 'MEDIUM': return 'clause-medium';
      case 'LOW': return 'clause-low';
      default: return 'clause-default';
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.clauseHighlighter = new ClauseHighlighter();
