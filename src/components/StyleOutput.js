import React from 'react';

function Swatch({ hex }) {
  return (
    <div className="swatch">
      <div className="swatch-color" style={{ backgroundColor: hex }} />
      <span className="swatch-hex">{hex}</span>
    </div>
  );
}

/**
 * Displays the image-derived colour palette and (when tags are selected)
 * the matching style direction label and description.
 *
 * Props:
 *   palette       — Array<{hex}> from image extraction
 *   styleDir      — { label, description } | null  from tag matching
 */
function StyleOutput({ palette, styleDir }) {
  if (!palette || palette.length === 0) return null;

  return (
    <div className="output-card">
      {/* Palette */}
      <div className="output-palette-section">
        <p className="output-label">Colour palette</p>
        <div className="palette">
          {palette.map(({ hex }) => <Swatch key={hex} hex={hex} />)}
        </div>
        <p className="palette-attribution">Palette inspired by your image</p>
      </div>

      {/* Style direction — only when tags are active */}
      {styleDir && (
        <div className="output-direction-section">
          <p className="output-label">Style direction</p>
          <h2 className="style-label">{styleDir.label}</h2>
          <p className="style-description">{styleDir.description}</p>
        </div>
      )}
    </div>
  );
}

export default StyleOutput;
