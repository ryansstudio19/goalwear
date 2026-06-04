import React, { useState } from 'react';
import { Ruler, Activity, HelpCircle } from 'lucide-react';

export default function SizeGuide() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const calculateSize = (e) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      alert("Please enter valid height and weight values.");
      return;
    }

    // Advanced sizing heuristic
    let size = "M";
    let fitText = "";

    if (h < 165 && w < 60) {
      size = "S";
      fitText = "Perfect standard slim fit for shorter, lighter frames.";
    } else if (h <= 173 && w <= 70) {
      size = "M";
      fitText = "Matches typical medium athletic contours. Highly popular choice.";
    } else if (h <= 180 && w <= 82) {
      size = "L";
      fitText = "Recommended. Designed for standard broad shoulders and standard height.";
    } else if (h <= 188 && w <= 93) {
      size = "XL";
      fitText = "Provides a loose supporter fit or regular fit for tall or wider frames.";
    } else {
      size = "XXL";
      fitText = "Double Extra Large. Accommodates very tall height or heavy athletic builds.";
    }

    setResult({ size, fitText });
  };

  const chartData = [
    { size: 'S', chest: '36 - 38 in', waist: '30 - 32 in', length: '27.5 in' },
    { size: 'M', chest: '38 - 40 in', waist: '32 - 34 in', length: '28.5 in' },
    { size: 'L', chest: '40 - 42 in', waist: '34 - 36 in', length: '29.5 in' },
    { size: 'XL', chest: '42 - 44 in', waist: '36 - 38 in', length: '30.5 in' },
    { size: 'XXL', chest: '44 - 46 in', waist: '38 - 40 in', length: '31.5 in' }
  ];

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Size <span>Guide</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Find the perfect fit for your matchday. Input metrics below to determine your recommended size.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '1.2fr 1fr',
        gap: '40px'
      }} className="sizeguide-grid">
        
        {/* Chart display */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Ruler size={22} color="var(--accent)" />
            <h2 style={{ fontSize: '1.3rem', textTransform: 'uppercase' }}>Standard Measurements</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'white' }}>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>Size</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>Chest Width</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>Waist Size</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>Back Length</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.size} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                    <td style={{ padding: '14px 10px', fontWeight: 700, color: 'var(--accent)' }}>{row.size}</td>
                    <td style={{ padding: '14px 10px' }}>{row.chest}</td>
                    <td style={{ padding: '14px 10px' }}>{row.waist}</td>
                    <td style={{ padding: '14px 10px' }}>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '24px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '0.8rem',
            lineHeight: 1.6
          }}>
            <strong>Supporter Fit vs. Player Fit:</strong> Our shirts are tailored to standard athletic specs (Supporter Fit). If you want an extremely tight athletic feel similar to players on-pitch, consider ordering one size smaller.
          </div>
        </div>

        {/* Dynamic Calculator */}
        <div className="glass-panel" style={{ padding: '28px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Activity size={22} color="var(--accent)" />
            <h2 style={{ fontSize: '1.3rem', textTransform: 'uppercase' }}>Fit Calculator</h2>
          </div>

          <form onSubmit={calculateSize} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }} className="calc-inputs-flex">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '120px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Height (cm)</label>
              <input
                type="number"
                required
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '120px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Weight (kg)</label>
              <input
                type="number"
                required
                placeholder="e.g. 74"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn-premium btn-primary-glow" style={{ width: '100%', padding: '12px 0', marginTop: '4px' }}>
              Calculate Size
            </button>
          </form>

          {/* Calculator Result Display */}
          {result && (
            <div 
              style={{
                marginTop: '24px',
                border: '1px solid var(--border-glass-hover)',
                backgroundColor: 'rgba(0, 255, 136, 0.05)',
                borderRadius: '8px',
                padding: '20px',
                animation: 'fade-in 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Recommended Size</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
                SIZE: {result.size}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'white', lineHeight: 1.5, marginTop: '4px' }}>
                {result.fitText}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .sizeguide-grid {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
