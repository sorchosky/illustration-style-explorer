import React, { useRef, useState, useCallback } from 'react';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve({ base64, mediaType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageUpload({
  onFileSelect,
  preview,
  isAnalyzing,
  imageTags,
  selectedImageTags,
  onToggleImageTag,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const previewUrl = URL.createObjectURL(file);
    const { base64, mediaType } = await fileToBase64(file);
    onFileSelect(file, base64, mediaType, previewUrl);
  }, [onFileSelect]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  return (
    <div>
      <div
        className={`upload-zone${isDragging ? ' dragging' : ''}${preview ? ' has-preview' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
        aria-label="Upload image"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span>Drop image here or click to upload</span>
            <span className="upload-sub">Extracts style tags &amp; color palette</span>
          </div>
        )}

        {isAnalyzing && (
          <div className="analyzing-overlay">
            <span>Analyzing image</span>
            <span className="loading-dots">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </span>
          </div>
        )}
      </div>

      {imageTags.length > 0 && (
        <div className="image-tags-section">
          <p className="image-tags-label">Extracted tags — click to toggle</p>
          <div className="tags-list">
            {imageTags.map(tag => (
              <button
                key={tag}
                className={`tag image-derived ${selectedImageTags.has(tag) ? 'selected' : ''}`}
                onClick={() => onToggleImageTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
