import React from 'react';

const Highlighter = ({ sentences }) => {
  if (!sentences || sentences.length === 0) return null;

  return (
    <div className="fade-in">
      {sentences.map((s, i) => (
        <div key={i} className={`sentence-row hl-${s.label}`}>
          <div className="sentence-meta">
            <span className="sentence-num">{i + 1}.</span>
            <span className={`badge badge-${s.label}`}>{s.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
              <div className="conf-track">
                <div
                  className="conf-fill"
                  style={{
                    width: `${(s.confidence * 100).toFixed(0)}%`,
                    background: labelColor(s.label),
                  }}
                />
              </div>
              <span className="text-xs text-muted">{(s.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
          <p className="sentence-text">{s.text}</p>
        </div>
      ))}
    </div>
  );
};

function labelColor(label) {
  const map = {
    BACKGROUND: '#0078d4',
    OBJECTIVE:  '#8764b8',
    METHODS:    '#f2a900',
    RESULTS:    '#107c10',
    CONCLUSION: '#d13438',
  };
  return map[label] || '#0078d4';
}

export default Highlighter;
