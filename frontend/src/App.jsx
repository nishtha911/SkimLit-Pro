import React, { useState } from 'react';
import './App.css';
import Highlighter from './components/Highlighter';
import Heatmap from './components/Heatmap';

const API = 'http://localhost:8000';

const SAMPLE = `To investigate the efficacy of aspirin in the primary prevention of cardiovascular disease among adults without prior cardiovascular events. We conducted a randomized, double-blind, placebo-controlled trial across 12 academic medical centers. Participants aged 50–70 years without prior cardiovascular events were randomly assigned to receive 100 mg aspirin daily or matching placebo for 5 years. The primary endpoint was a composite of cardiovascular death, non-fatal myocardial infarction, and non-fatal stroke. A total of 15,480 patients were enrolled. The primary composite endpoint occurred in 4.1% of the aspirin group versus 4.9% in the placebo group (HR 0.83, 95% CI 0.72–0.96, p=0.011). Gastrointestinal bleeding was more frequent in the aspirin group (2.7% vs 1.2%, p<0.001). Daily low-dose aspirin significantly reduced the risk of major cardiovascular events in adults without prior cardiovascular disease, though this benefit must be weighed against the increased risk of gastrointestinal bleeding.`;

const LABELS_META = [
  { label: 'BACKGROUND', color: '#0078d4', dot: '#cce4f6' },
  { label: 'OBJECTIVE',  color: '#8764b8', dot: '#e6d8f5' },
  { label: 'METHODS',    color: '#f2a900', dot: '#fff4ce' },
  { label: 'RESULTS',    color: '#107c10', dot: '#dff6dd' },
  { label: 'CONCLUSION', color: '#d13438', dot: '#fce4ec' },
];

/* ─── Icons ─── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  logo:    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  analyse: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  compare: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  input:   'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  results: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  clear:   'M6 18L18 6M6 6l12 12',
  warn:    'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
};

/* ─── Shared async call ─── */
async function callPredict(text) {
  const res = await fetch(`${API}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ abstract: text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.sentences;
}

/* ─── Stat pills ─── */
function StatPills({ sentences }) {
  const counts = {};
  sentences.forEach(s => { counts[s.label] = (counts[s.label] || 0) + 1; });
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {LABELS_META.map(({ label, color }) =>
        counts[label] ? (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.714rem',
            background: '#f5f7fa', border: `1px solid ${color}30`, borderRadius: 3, padding: '2px 8px', color }}>
            <b>{counts[label]}</b>&nbsp;{label}
          </span>
        ) : null
      )}
    </div>
  );
}

/* ─── Analyse Page ─── */
function AnalysePage() {
  const [abstract, setAbstract] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('highlight');

  const handleAnalyse = async () => {
    if (!abstract.trim()) return;
    setLoading(true); setError(null); setResults(null);
    try { setResults(await callPredict(abstract)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="workspace">
      {/* Input Panel */}
      <div className="card">
        <div className="card-header">
          <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={ICONS.input} /></svg>
          <span style={{ fontWeight: 600, fontSize: '0.929rem' }}>Input Abstract</span>
          <button className="sample-btn" style={{ marginLeft: 'auto' }}
            onClick={() => setAbstract(SAMPLE)}>Load sample</button>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <textarea
            className="az-textarea"
            rows={16}
            placeholder="Paste or type a PubMed medical abstract here…"
            value={abstract}
            onChange={e => setAbstract(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleAnalyse}
              disabled={loading || !abstract.trim()}>
              {loading
                ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Analysing…</>
                : <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg> Analyse</>}
            </button>
            <button className="btn btn-ghost" onClick={() => { setAbstract(''); setResults(null); setError(null); }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={ICONS.clear} /></svg> Clear
            </button>
            {abstract && (
              <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>
                {abstract.trim().split(/\s+/).length} words
              </span>
            )}
          </div>
          {error && (
            <div className="alert-error">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={ICONS.warn} /></svg>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Panel */}
      <div className="card">
        <div className="card-header">
          <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={ICONS.results} /></svg>
          <span style={{ fontWeight: 600, fontSize: '0.929rem' }}>Results</span>
          {results && (
            <div className="view-toggle" style={{ marginLeft: 'auto' }}>
              <button className={`view-toggle-btn${view === 'highlight' ? ' active' : ''}`}
                onClick={() => setView('highlight')}>Highlight</button>
              <button className={`view-toggle-btn${view === 'heatmap' ? ' active' : ''}`}
                onClick={() => setView('heatmap')}>Heatmap</button>
            </div>
          )}
        </div>

        {results && <div style={{ padding: '8px 20px 0' }}><StatPills sentences={results} /></div>}

        <div className="card-body" style={{ minHeight: 340 }}>
          {!results && !loading && (
            <div className="empty-state">
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p style={{ fontSize: '0.857rem' }}>Analysis results will appear here</p>
              <p className="text-xs">Paste an abstract and click <strong>Analyse</strong></p>
            </div>
          )}
          {loading && (
            <div className="empty-state">
              <span className="spinner" />
              <p style={{ fontSize: '0.857rem' }}>Running model inference…</p>
            </div>
          )}
          {results && !loading && (
            view === 'highlight'
              ? <Highlighter sentences={results} />
              : <Heatmap data={results} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Compare Page ─── */
function ComparePage() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [resA, setResA] = useState(null);
  const [resB, setResB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    if (!textA.trim() || !textB.trim()) return;
    setLoading(true); setError(null); setResA(null); setResB(null);
    try {
      const res = await fetch(`${API}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstract_a: textA, abstract_b: textB }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `HTTP ${res.status}`); }
      const data = await res.json();
      setResA(data.a); setResB(data.b);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Input row */}
      <div className="compare-grid">
        {[{ label: 'Abstract A', text: textA, set: setTextA }, { label: 'Abstract B', text: textB, set: setTextB }]
          .map(({ label, text, set }) => (
            <div className="card" key={label}>
              <div className="card-header">
                <span style={{ fontWeight: 600, fontSize: '0.929rem' }}>{label}</span>
              </div>
              <div className="card-body">
                <textarea className="az-textarea" rows={10}
                  placeholder={`Paste ${label} here…`} value={text} onChange={e => set(e.target.value)} />
              </div>
            </div>
          ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn btn-primary" onClick={handleCompare}
          disabled={loading || !textA.trim() || !textB.trim()}>
          {loading
            ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Comparing…</>
            : 'Compare Abstracts'}
        </button>
        <button className="btn btn-ghost" onClick={() => { setTextA(''); setTextB(''); setResA(null); setResB(null); setError(null); }}>Clear All</button>
        {error && <span className="alert-error" style={{ marginLeft: 8 }}>{error}</span>}
      </div>

      {/* Results row */}
      {(resA || resB) && (
        <div className="compare-grid">
          {[{ label: 'Abstract A Results', res: resA }, { label: 'Abstract B Results', res: resB }]
            .map(({ label, res }) => (
              <div className="card" key={label}>
                <div className="card-header">
                  <span style={{ fontWeight: 600, fontSize: '0.929rem' }}>{label}</span>
                  {res && <div style={{ marginLeft: 'auto' }}><StatPills sentences={res} /></div>}
                </div>
                <div className="card-body" style={{ minHeight: 200 }}>
                  {res ? <Highlighter sentences={res} /> : (
                    <div className="empty-state"><p className="text-xs">No results yet</p></div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

/* ─── Root App ─── */
export default function App() {
  const [page, setPage] = useState('analyse');

  return (
    <div className="app-shell">
      {/* Top Nav */}
      <nav className="topnav">
        <div className="topnav-logo">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          SkimLit Pro <span>| Medical Abstract Classifier</span>
        </div>
        <div className="topnav-links">
          <button className={`topnav-link${page === 'analyse' ? ' active' : ''}`} onClick={() => setPage('analyse')}>Analyse</button>
          <button className={`topnav-link${page === 'compare' ? ' active' : ''}`} onClick={() => setPage('compare')}>Compare</button>
        </div>
      </nav>

      {/* Sub-nav */}
      <div className="subnav">
        {[
          { key: 'analyse', label: 'Sentence Classifier' },
          { key: 'compare', label: 'Side-by-Side Compare' },
        ].map(({ key, label }) => (
          <button key={key} className={`nav-tab${page === key ? ' active' : ''}`} onClick={() => setPage(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="legend-row">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.714rem', marginRight: 4 }}>Labels:</span>
        {LABELS_META.map(({ label, color }) => (
          <span key={label} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Page */}
      <main className="page-content">
        {page === 'analyse' ? <AnalysePage /> : <ComparePage />}
      </main>

      {/* Status bar */}
      <footer className="statusbar">
        <span>SkimLit Pro v1.0</span>
        <span>Model: TensorFlow · PubMed RCT-20k</span>
        <span>Backend: <a href="http://localhost:8000/health" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>localhost:8000</a></span>
      </footer>
    </div>
  );
}
