import React from 'react';

const CLASSES = ['BACKGROUND', 'OBJECTIVE', 'METHODS', 'RESULTS', 'CONCLUSION'];

const COLOR_MAP = {
  BACKGROUND: { bg: 'rgba(0,120,212,VAL)',  text: '#004b87' },
  OBJECTIVE:  { bg: 'rgba(135,100,184,VAL)', text: '#5c2d91' },
  METHODS:    { bg: 'rgba(242,169,0,VAL)',   text: '#7d5c00' },
  RESULTS:    { bg: 'rgba(16,124,16,VAL)',   text: '#1e6e1e' },
  CONCLUSION: { bg: 'rgba(209,52,56,VAL)',   text: '#a80000' },
};

function getHeatCell(score, cls) {
  const opacity = Math.min(0.9, Math.max(0.07, score));
  const bg = COLOR_MAP[cls]?.bg.replace('VAL', opacity) || `rgba(0,0,0,${opacity})`;
  const textColor = opacity > 0.45 ? '#fff' : (COLOR_MAP[cls]?.text || '#333');
  return { backgroundColor: bg, color: textColor };
}

const Heatmap = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="fade-in" style={{ overflowX: 'auto' }}>
      <table className="heatmap-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', minWidth: 220 }}>#&nbsp;&nbsp;Sentence</th>
            {CLASSES.map(cls => <th key={cls}>{cls}</th>)}
            <th>Predicted</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: 'left', color: 'var(--text-primary)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.786rem' }}
                  title={item.text}>
                <span style={{ color: 'var(--text-muted)', marginRight: 6 }}>{idx + 1}.</span>
                {item.text}
              </td>
              {CLASSES.map(cls => {
                const score = item.all_scores?.[cls] ?? 0;
                return (
                  <td key={cls} style={getHeatCell(score, cls)}>
                    {(score * 100).toFixed(0)}%
                  </td>
                );
              })}
              <td>
                <span className={`badge badge-${item.label}`}>{item.label}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;
