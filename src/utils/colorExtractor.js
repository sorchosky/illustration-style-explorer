/**
 * Tag-aware dominant colour extractor using HTML Canvas.
 *
 * Two-phase API so tags can change without re-loading the image:
 *   sampleImage(file)              → Promise<FreqMap>  (async, run once per image)
 *   selectColors(freqMap, tags)    → Array<{hex}>      (sync, re-run on tag changes)
 *
 * FreqMap: Map<"r,g,b", count>  (quantised to 32-step buckets)
 */

// ── Colour space helpers ──────────────────────────────────────────────────────

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6; break;
  }
  return [h * 360, s, l]; // h 0–360, s/l 0–1
}

function hslToRgb(h, s, l) {
  h /= 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = t => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [
    Math.round(hue2rgb(h + 1 / 3) * 255),
    Math.round(hue2rgb(h)         * 255),
    Math.round(hue2rgb(h - 1 / 3) * 255),
  ];
}

function toHex(r, g, b) {
  return '#' + [r, g, b]
    .map(n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0'))
    .join('');
}

// ── Tag scoring ───────────────────────────────────────────────────────────────

/**
 * Returns a multiplier (> 0) for how well this RGB pixel fits the active tags.
 * Higher = more likely to be selected.
 */
function scoreForTags(r, g, b, tags) {
  if (!tags.length) return 1;
  const [h, s, l] = rgbToHsl(r, g, b);
  let score = 1;

  for (const tag of tags) {
    switch (tag) {
      case 'bold':
        // High saturation + strong contrast (away from mid-grey)
        score *= (1 + s * 1.6) * (1 + Math.abs(l - 0.5) * 2.2);
        break;

      case 'minimal':
        // Neutral / muted — low saturation, near-grey
        score *= Math.max(0.02, 1 - s * 1.3);
        break;

      case 'dark':
        // Darkest pixels; exponential to strongly prefer shadows
        score *= Math.pow(Math.max(0.01, 1 - l), 2);
        break;

      case 'playful':
        // Maximum saturation variety
        score *= 1 + s * 2.8;
        break;

      case 'geometric':
        // Handled as post-process hue spread — no per-pixel bias
        break;

      case 'organic': {
        // Warm earthy range (orange–yellow-green: 20–80°) at mid-lightness
        const warm = (h >= 20 && h <= 80) ? 2.4 : (h > 285 || h < 20 ? 1.4 : 0.45);
        const mid  = (l >= 0.25 && l <= 0.68) ? 1.5 : 0.55;
        score *= warm * mid;
        break;
      }

      case 'delicate':
        // Light, low-saturation, pastel-adjacent
        score *= (0.15 + l * 1.4) * (0.25 + (1 - s) * 0.95);
        break;

      case 'textural':
        // Broad mid-range — include darks, mids, and near-lights
        score *= (l >= 0.12 && l <= 0.82) ? 1.5 : 0.45;
        break;

      case 'retro': {
        // Warm tones at moderate saturation (aged, faded)
        const warm   = (h < 65 || h > 295) ? 1.9 : 0.55;
        const modSat = (s >= 0.08 && s <= 0.62) ? 1.5 : 0.65;
        score *= warm * modSat;
        break;
      }

      case 'futuristic': {
        // Blue-adjacent cool hues (175–265°), high contrast
        const cool    = (h >= 175 && h <= 265) ? 2.6 : 0.35;
        const hiContr = (l < 0.28 || l > 0.68) ? 1.7 : 0.75;
        score *= cool * hiContr;
        break;
      }

      default: break;
    }
  }

  return Math.max(0.001, score);
}

// ── Post-processing transforms ────────────────────────────────────────────────

/** 'retro': slight desaturation + nudge toward warm, faded lightness */
function applyRetroTone(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const newS = s * 0.76;
  const nudge = (30 - h) * 0.12; // gently pull toward orange-warmth
  const newH = Math.max(0, Math.min(360, h + Math.max(-9, Math.min(9, nudge))));
  const newL = Math.min(0.91, l * 1.05);
  return hslToRgb(newH, newS, newL);
}

/** 'geometric': re-select colours to spread evenly around the hue wheel */
function geometricSpread(candidates, count) {
  const withHsl = candidates.map(c => ({ ...c, hsl: rgbToHsl(c.r, c.g, c.b) }));
  const step = 360 / count;
  const selected = [];

  for (let i = 0; i < count; i++) {
    const target = i * step;
    const remaining = withHsl.filter(c => !selected.includes(c));
    if (!remaining.length) break;
    const closest = remaining.slice().sort((a, b) => {
      const dA = Math.min(Math.abs(a.hsl[0] - target), 360 - Math.abs(a.hsl[0] - target));
      const dB = Math.min(Math.abs(b.hsl[0] - target), 360 - Math.abs(b.hsl[0] - target));
      return dA - dB;
    })[0];
    selected.push(closest);
  }

  // Pad with highest-scoring remaining if needed
  for (const c of withHsl) {
    if (selected.length >= count) break;
    if (!selected.includes(c)) selected.push(c);
  }

  return selected.slice(0, count).map(({ r, g, b }) => ({ hex: toHex(r, g, b) }));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Loads an image File and returns a quantised pixel-frequency Map.
 * Run once per uploaded image; cache the result in a ref.
 *
 * @param {File} file
 * @returns {Promise<Map<string, number>>}
 */
export function sampleImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        URL.revokeObjectURL(url);
        const MAX = 220;
        const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight, 1));
        const w = Math.max(1, Math.round(img.naturalWidth  * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const { data } = ctx.getImageData(0, 0, w, h);
        const freq = new Map();
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue;
          const r = Math.min(255, Math.round(data[i]     / 32) * 32);
          const g = Math.min(255, Math.round(data[i + 1] / 32) * 32);
          const b = Math.min(255, Math.round(data[i + 2] / 32) * 32);
          const key = `${r},${g},${b}`;
          freq.set(key, (freq.get(key) || 0) + 1);
        }
        resolve(freq);
      } catch (e) { reject(e); }
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

/**
 * Selects N diverse colours from a cached frequency map, weighted by active tags.
 * Synchronous — call whenever tags change.
 *
 * @param {Map<string, number>} freqMap
 * @param {string[]}            tags     — active tag names
 * @param {number}              count    — number of swatches (default 5)
 * @returns {Array<{hex: string}>}
 */
export function selectColors(freqMap, tags = [], count = 5) {
  const targetCount = tags.includes('minimal') ? 3 : count;
  const applyRetro  = tags.includes('retro');
  const isGeometric = tags.includes('geometric');

  // Weight each quantised colour by frequency × tag score
  const candidates = [...freqMap.entries()]
    .map(([key, freq]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { r, g, b, score: freq * scoreForTags(r, g, b, tags) };
    })
    .sort((a, b) => b.score - a.score);

  // Geometric: post-process to spread hues evenly
  if (isGeometric) return geometricSpread(candidates, targetCount);

  // Greedy diverse selection — relax min-distance on each retry
  let selected = [];
  for (const minDist of [85, 58, 38, 22, 0]) {
    selected = [];
    for (const c of candidates) {
      if (selected.length >= targetCount) break;
      const tooClose = selected.some(s => {
        const dr = c.r - s.r, dg = c.g - s.g, db = c.b - s.b;
        return Math.sqrt(dr * dr + dg * dg + db * db) < minDist;
      });
      if (!tooClose) selected.push(c);
    }
    if (selected.length >= targetCount) break;
  }

  return selected.slice(0, targetCount).map(({ r, g, b }) => {
    const [fr, fg, fb] = applyRetro ? applyRetroTone(r, g, b) : [r, g, b];
    return { hex: toHex(fr, fg, fb) };
  });
}
