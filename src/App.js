import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PresetTags from './components/PresetTags';
import CustomTagInput from './components/CustomTagInput';
import ImageUpload from './components/ImageUpload';
import StyleOutput from './components/StyleOutput';
import { analyzeImage, generateStyleOutput } from './api/anthropic';
import './App.css';

const PRESET_TAGS = [
  'bold', 'minimal', 'geometric', 'organic', 'playful',
  'dark', 'delicate', 'textural', 'retro', 'futuristic',
];

function App() {
  // Preset tag selection
  const [selectedPresets, setSelectedPresets] = useState(new Set());

  // Custom tags (user-typed) + which ones are active
  const [customTags, setCustomTags] = useState([]);
  const [selectedCustomTags, setSelectedCustomTags] = useState(new Set());

  // Tags extracted from image analysis + which ones are active
  const [imageTags, setImageTags] = useState([]);
  const [selectedImageTags, setSelectedImageTags] = useState(new Set());

  // Image state
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePalette, setImagePalette] = useState(null);

  // Output state
  const [styleOutput, setStyleOutput] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Combined list of all currently active tags
  const allSelectedTags = useMemo(() => [
    ...Array.from(selectedPresets),
    ...customTags.filter(t => selectedCustomTags.has(t)),
    ...imageTags.filter(t => selectedImageTags.has(t)),
  ], [selectedPresets, customTags, selectedCustomTags, imageTags, selectedImageTags]);

  // Debounced style generation — fires when tags or image palette change
  useEffect(() => {
    const hasAnyInput = allSelectedTags.length > 0 || !!imagePalette;

    if (!hasAnyInput) {
      setStyleOutput(null);
      setIsGenerating(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGenerating(true);
      setError(null);
      try {
        const result = await generateStyleOutput(allSelectedTags, imagePalette);
        setStyleOutput(result);
      } catch (err) {
        setError(err.message || 'Failed to generate style output.');
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [allSelectedTags, imagePalette]); // eslint-disable-line react-hooks/exhaustive-deps

  // Called by ImageUpload when a file is selected
  const handleFileSelect = useCallback(async (file, base64, mediaType, previewUrl) => {
    setImagePreview(previewUrl);
    setIsAnalyzing(true);
    setError(null);
    setImageTags([]);
    setSelectedImageTags(new Set());
    setImagePalette(null);

    try {
      const result = await analyzeImage(base64, mediaType);
      const tags = result.styleTags || [];
      setImageTags(tags);
      setSelectedImageTags(new Set(tags));
      setImagePalette(result.colorPalette || null);
    } catch (err) {
      setError(err.message || 'Failed to analyze image.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const togglePreset = useCallback((tag) => {
    setSelectedPresets(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }, []);

  const addCustomTag = useCallback((tag) => {
    const clean = tag.trim().toLowerCase();
    if (!clean) return;
    setCustomTags(prev => prev.includes(clean) ? prev : [...prev, clean]);
    setSelectedCustomTags(prev => new Set([...prev, clean]));
  }, []);

  const toggleCustomTag = useCallback((tag) => {
    setSelectedCustomTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }, []);

  const toggleImageTag = useCallback((tag) => {
    setSelectedImageTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }, []);

  const hasInput = allSelectedTags.length > 0 || !!imagePalette;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Illustration Style Explorer</h1>
        <p>Combine style tags and reference images to generate a visual direction</p>
      </header>

      <main className="app-main">
        <section className="inputs-grid">
          <div className="input-card">
            <h2 className="input-card-label">Preset Tags</h2>
            <PresetTags
              tags={PRESET_TAGS}
              selected={selectedPresets}
              onToggle={togglePreset}
            />
          </div>

          <div className="input-card">
            <h2 className="input-card-label">Custom Tags</h2>
            <CustomTagInput
              tags={customTags}
              selected={selectedCustomTags}
              onAdd={addCustomTag}
              onToggle={toggleCustomTag}
            />
          </div>

          <div className="input-card">
            <h2 className="input-card-label">Image Analysis</h2>
            <ImageUpload
              onFileSelect={handleFileSelect}
              preview={imagePreview}
              isAnalyzing={isAnalyzing}
              imageTags={imageTags}
              selectedImageTags={selectedImageTags}
              onToggleImageTag={toggleImageTag}
            />
          </div>
        </section>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <section className="output-card">
          <StyleOutput
            output={styleOutput}
            isGenerating={isGenerating}
            hasInput={hasInput}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
