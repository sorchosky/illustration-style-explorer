import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ImageUpload from './components/ImageUpload';
import PresetTags from './components/PresetTags';
import StyleOutput from './components/StyleOutput';
import ThemeToggle from './components/ThemeToggle';
import { sampleImage, selectColors } from './utils/colorExtractor';
import { getStyleFromTags } from './data/styleProfiles';
import './App.css';

const PRESET_TAGS = [
  'bold', 'minimal', 'geometric', 'organic', 'playful',
  'dark', 'delicate', 'textural', 'retro', 'futuristic',
];

function App() {
  const [isDark, setIsDark]         = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [imagePreview, setPreview]  = useState(null);
  const [activeTags, setActiveTags] = useState(new Set());
  const [palette, setPalette]       = useState(null);
  const [isExtracting, setExtracting] = useState(false);

  // Cached quantised pixel data — re-used on every tag change
  const freqMapRef = useRef(null);

  // Apply theme to <html> element so CSS vars cascade everywhere
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  // Style direction from active tags (sync, derived)
  const styleDir = useMemo(
    () => getStyleFromTags([...activeTags]),
    [activeTags]
  );

  // ── Image upload ──────────────────────────────────────────────────────────

  const handleFileSelect = useCallback(async (file, previewUrl) => {
    setPreview(previewUrl);
    setActiveTags(new Set());      // reset tags for new image
    freqMapRef.current = null;
    setPalette(null);
    setExtracting(true);
    try {
      const freq = await sampleImage(file);
      freqMapRef.current = freq;
      setPalette(selectColors(freq, []));   // no tags yet — raw extraction
    } catch (err) {
      console.error('Colour extraction failed:', err);
    } finally {
      setExtracting(false);
    }
  }, []);

  // Re-apply colours whenever tags change (sync — no loading state)
  useEffect(() => {
    if (freqMapRef.current) {
      setPalette(selectColors(freqMapRef.current, [...activeTags]));
    }
  }, [activeTags]);

  // ── Tag toggle ────────────────────────────────────────────────────────────

  const toggleTag = useCallback((tag) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  const hasImage = !!imagePreview;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-text">
          <h1 className="app-title">Illustration Style Explorer</h1>
          <p className="app-subtitle">Upload a reference image to explore visual style directions</p>
        </div>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
      </header>

      <main className="app-main">
        {/* ── Hero upload zone ── */}
        <ImageUpload
          onFileSelect={handleFileSelect}
          preview={imagePreview}
          isExtracting={isExtracting}
        />

        {/* ── Tags + output — revealed after upload ── */}
        {hasImage && !isExtracting && (
          <>
            <section className="tags-section">
              <div className="tags-section-header">
                <h2 className="tags-section-title">Refine with style tags</h2>
                <p className="tags-section-sub">
                  Tags influence which colours are surfaced from your image
                </p>
              </div>
              <PresetTags
                tags={PRESET_TAGS}
                selected={activeTags}
                onToggle={toggleTag}
              />
            </section>

            <StyleOutput palette={palette} styleDir={styleDir} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
