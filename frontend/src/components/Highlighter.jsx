import React from 'react';

const Highlighter = ({ sentences }) => {
  const getStyles = (label) => {
    switch (label) {
      case 'BACKGROUND': return { backgroundColor: '#dbeafe', padding: '2px 4px', borderRadius: '4px' }; // blue
      case 'OBJECTIVE': return { backgroundColor: '#f3e8ff', padding: '2px 4px', borderRadius: '4px' };  // purple
      case 'METHODS': return { backgroundColor: '#fef3c7', padding: '2px 4px', borderRadius: '4px' };    // amber
      case 'RESULTS': return { backgroundColor: '#dcfce7', padding: '2px 4px', borderRadius: '4px' };    // green
      case 'CONCLUSION': return { backgroundColor: '#fee2e2', padding: '2px 4px', borderRadius: '4px' };   // red
      default: return {};
    }
  };

  if (!sentences || sentences.length === 0) return null;

  return (
    <div style={{ lineHeight: '1.8' }}>
      {sentences.map((s, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '0.7em', fontWeight: 'bold', marginRight: '5px', color: '#666' }}>
            {s.label} ({(s.confidence * 100).toFixed(0)}%)
          </span>
          <span style={getStyles(s.label)}>
            {s.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Highlighter;
