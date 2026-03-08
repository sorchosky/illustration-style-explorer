import React, { useState, useMemo, useCallback } from 'react';
import PresetTags from './components/PresetTags';
import CustomTagInput from './components/CustomTagInput';
import ImageUpload from './components/ImageUpload';
import StyleOutput from './components/StyleOutput';
import { getStyleFromTags } from './data/styleProfiles';
import './App.css';

const PRESET_TAGS = [
  'bold', 'minimal', 'geometric', 'organic', 'playful',
  'dark', 'delicate', 'textural', 'retro', 'futuristic',
];

function App() {
  const [selectedPresets, setSelectedPresets]       = useState(new Set());
  const [customTags, setCustomTags]                 = useState([]);
  const [selectedCustomTags, setSelectedCustomTags] = useState(new Set());

  // All currently active tags, combined
  const allSelectedTags = useMemo(() => [
    ...Array.from(selectedPresets),
    ...customTags.filter(t => selectedCustomTags.has(t)),
  ], [selectedPresets, customTags, selectedCustomTags]);

  // Style direction derived synchronously — no API call needed
  const styleOutput = useMemo(
    () => getStyleFromTags(allSelectedTags),
    [allSelectedTags]
  );

  const hasInput = allSelectedTags.length > 0;

  // ── Handlers ───────────────────────────────────────────────────────────────

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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      <header className="app-header">
        <h1>Illustration Style Explorer</h1>
        <p>Combine style tags and reference images to discover your visual direction</p>
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
            <h2 className="input-card-label">Colour Extractor</h2>
            <ImageUpload />
          </div>
        </section>

        <section className="output-card">
          <StyleOutput output={styleOutput} hasInput={hasInput} />
        </section>
      </main>
    </div>
  );
}

export default App;
