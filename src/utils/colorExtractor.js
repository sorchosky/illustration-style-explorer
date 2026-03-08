/**
 * Canvas-based dominant color extractor.
 *
 * Process:
 *  1. Load the image into a small off-screen canvas (max 160 px on longest edge)
 *  2. Read every pixel, quantise R/G/B to 32-value steps (8 buckets per channel)
 *  3. Build a frequency map of quantised colours, sort by count (most frequent first)
 *  4. Walk the sorted list and greedily pick colours that are at least `minDist`
 *     apart in Euclidean RGB space — retrying with a lower threshold until we
 *     have enough distinct swatches
 *
 * @param {File}   file     — an image File object from a file input or drop event
 * @param {number} count    — number of colours to return (default 5)
 * @returns {Promise<Array<{hex: string}>>}
 */
export function extractColorsFromImage(file, count = 5) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);

        // Downscale to at most 160 px on the longest side for performance
        const MAX = 160;
        const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight, 1));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const { data } = ctx.getImageData(0, 0, w, h);

        // Build frequency map — quantise to 32-step buckets
        const freq = new Map();
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 128) continue; // skip transparent / semi-transparent pixels

          const r = Math.min(255, Math.round(data[i]     / 32) * 32);
          const g = Math.min(255, Math.round(data[i + 1] / 32) * 32);
          const b = Math.min(255, Math.round(data[i + 2] / 32) * 32);
          const key = `${r},${g},${b}`;
          freq.set(key, (freq.get(key) || 0) + 1);
        }

        // Sort by frequency, most-common first
        const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);

        // Greedy diverse-colour selection — try progressively looser thresholds
        let selected = [];
        for (const minDist of [90, 60, 40, 20, 0]) {
          selected = [];
          for (const [key] of sorted) {
            if (selected.length >= count) break;
            const [r, g, b] = key.split(',').map(Number);
            const tooClose = selected.some(([sr, sg, sb]) => {
              const dr = r - sr, dg = g - sg, db = b - sb;
              return Math.sqrt(dr * dr + dg * dg + db * db) < minDist;
            });
            if (!tooClose) selected.push([r, g, b]);
          }
          if (selected.length >= count) break;
        }

        const toHex = n => n.toString(16).padStart(2, '0');
        resolve(
          selected.slice(0, count).map(([r, g, b]) => ({
            hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
          }))
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image for colour extraction.'));
    };

    img.src = objectUrl;
  });
}
