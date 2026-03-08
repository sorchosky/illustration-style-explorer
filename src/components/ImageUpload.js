import React, { useRef, useState, useCallback } from 'react';

function ImageUpload({ onFileSelect, preview, isExtracting }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const previewUrl = URL.createObjectURL(file);
    onFileSelect(file, previewUrl);
  }, [onFileSelect]);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };
  const handleDrop      = (e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); };
  const handleClick     = () => fileInputRef.current?.click();
  const handleChange    = (e) => { processFile(e.target.files[0]); e.target.value = ''; };

  return (
    <div
      className={`upload-hero${isDragging ? ' dragging' : ''}${preview ? ' has-preview' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={preview ? 'Change reference image' : 'Upload a reference image'}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {preview ? (
        <>
          <img src={preview} alt="Reference" className="hero-preview" />
          <div className="hero-change-overlay">
            <span className="hero-change-label">Change image</span>
          </div>
        </>
      ) : (
        <div className="hero-prompt">
          <div className="hero-icon-wrap">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h2 className="hero-title">Upload a reference image</h2>
          <p className="hero-subtitle">Drag and drop, or click to browse</p>
          <p className="hero-formats">Supports JPG, PNG, WebP, GIF</p>
        </div>
      )}

      {isExtracting && (
        <div className="hero-extracting">
          <span>Extracting colours</span>
          <span className="loading-dots" aria-hidden="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </span>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
