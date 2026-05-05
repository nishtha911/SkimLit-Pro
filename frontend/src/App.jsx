import React, { useState } from 'react';
import Highlighter from './components/Highlighter';
import Heatmap from './components/Heatmap';

function App() {
  const [abstract, setAbstract] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('highlight');

  const handleAnalyse = async () => {
    if (!abstract.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ abstract }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze abstract');
      }

      const data = await response.json();
      setResults(data.sentences);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <h1>SkimLit Pro</h1>
        <nav>
          <button onClick={() => {}} style={{ marginRight: '10px' }}>Analyse</button>
          <button onClick={() => {}}>Compare</button>
        </nav>
      </header>

      <main style={{ display: 'flex', gap: '20px' }}>
        {/* Input Panel */}
        <div style={{ flex: 1 }}>
          <h3>Input Abstract</h3>
          <textarea
            style={{ width: '100%', height: '400px', padding: '10px' }}
            placeholder="Paste medical abstract here..."
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          ></textarea>
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={handleAnalyse} 
              disabled={loading || !abstract.trim()}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              {loading ? 'Processing...' : 'Analyse'}
            </button>
            <button onClick={() => setAbstract('')} style={{ marginLeft: '10px' }}>Clear</button>
          </div>
        </div>

        {/* Output Panel */}
        <div style={{ flex: 1, border: '1px solid #eee', padding: '10px', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Results</h3>
            {results && (
              <div>
                <button onClick={() => setViewMode('highlight')} style={{ fontWeight: viewMode === 'highlight' ? 'bold' : 'normal' }}>Highlighter</button>
                <button onClick={() => setViewMode('heatmap')} style={{ marginLeft: '5px', fontWeight: viewMode === 'heatmap' ? 'bold' : 'normal' }}>Heatmap</button>
              </div>
            )}
          </div>

          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {loading && <p>Loading analysis...</p>}
          
          {!results && !loading && <p>Analysis will appear here.</p>}

          {results && !loading && (
            <div>
              {viewMode === 'highlight' ? (
                <Highlighter sentences={results} />
              ) : (
                <Heatmap data={results} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
