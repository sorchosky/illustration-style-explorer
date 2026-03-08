import React, { useRef, useState, useCallback } from 'react';
import { extractColorsFromImage } from '../utils/colorExtractor';

function ImageUpload() {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [palette, setPalette] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);

  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    setPreview(URL.createObjectURL(file));
    setPalette([]);
    setError(null);
    setIsExtracting(true);

    try {
      const colors = await extractColorsFromImage(file, 5);
      setPalette(colors);
    } catch (err) {
      setError('Could not extract colours — try a different image.');
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };
  const handleClick      = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  return (
    <div>
      {/* Drop / click zone */}
      <div
        className={`upload-zone${isDragging ? ' dragging' : ''}${preview ? ' has-preview' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
        aria-label="Upload image to extract colours"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {preview ? (
          <img src={preview} alt="Uploaded reference" className="preview-image" />
        ) : (
          <div className="upload-prompt">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span>Drop image here or click to upload</span>
            <span className="upload-sub">Samples dominant colours via canvas</span>
          </div>
        )}

        {isExtracting && (
          <div className="analyzing-overlay">
            <span>Sampling colours</span>
            <span className="loading-dots">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </span>
          </div>
        )}
      </div>

      {/* Extracted palette */}
      {palette.length > 0 && (
        <div className="extracted-palette">
          <p className="extracted-palette-label">Extracted palette</p>
          <div className="palette">
            {palette.map(({ hex }) => (
              <div key={hex} className="swatch">
                <div className="swatch-color swatch-color--sm" style={{ backgroundColor: hex }} />
                <span className="swatch-hex">{hex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

export default ImageUpload;
