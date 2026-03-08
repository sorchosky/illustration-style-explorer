import React from 'react';

function Swatch({ hex, name }) {
  return (
    <div className="swatch">
      <div className="swatch-color" style={{ backgroundColor: hex }} />
      <span className="swatch-hex">{hex}</span>
      {name && <span className="swatch-name">{name}</span>}
    </div>
  );
}

function StyleOutput({ output, isGenerating, hasInput }) {
  if (!hasInput) {
    return (
      <div className="output-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="output-empty-icon">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 3" />
        </svg>
        <span>Select tags or upload an image to generate a style direction</span>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="output-loading">
        <span>Generating style direction</span>
        <span className="loading-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
      </div>
    );
  }

  if (!output) return null;

  return (
    <div className="output-content">
      <div className="output-left">
        <p className="output-section-label">Color Palette</p>
        <div className="palette">
          {output.colorPalette?.map(({ hex, name }) => (
            <Swatch key={hex} hex={hex} name={name} />
          ))}
        </div>
      </div>

      <div className="output-right">
        <p className="output-section-label">Style Direction</p>
        <h2 className="style-label">{output.styleLabel}</h2>
        <p className="style-description">{output.description}</p>
      </div>
    </div>
  );
}

export default StyleOutput;
