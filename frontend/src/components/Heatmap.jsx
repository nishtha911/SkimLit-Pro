import React from 'react';

const CLASSES = ["BACKGROUND", "OBJECTIVE", "METHODS", "RESULTS", "CONCLUSION"];

const Heatmap = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Sentence</th>
            {CLASSES.map(cls => (
              <th key={cls} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{cls}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #ddd', padding: '8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.text}>
                {idx + 1}. {item.text}
              </td>
              {CLASSES.map(cls => {
                const score = item.all_scores?.[cls] || 0;
                const opacity = Math.max(0.1, score);
                return (
                  <td 
                    key={cls} 
                    style={{ 
                      border: '1px solid #ddd', 
                      padding: '8px', 
                      textAlign: 'center',
                      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
                      color: opacity > 0.5 ? 'white' : 'black'
                    }}
                  >
                    {(score * 100).toFixed(0)}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;
