/**
 * Style profiles — each maps a set of preset tag keywords to a style direction.
 * Tags must come from the preset list: bold, minimal, geometric, organic,
 * playful, dark, delicate, textural, retro, futuristic.
 *
 * Scoring: matchCount + (matchCount / profileTagCount)
 * — rewards specificity (more matched tags wins) and precision (small profiles
 *   that fully match beat large profiles that partially match).
 */
export const STYLE_PROFILES = [
  // ── Two-tag profiles (broad anchors) ─────────────────────────────────────
  {
    tags: ['geometric', 'minimal'],
    label: 'Swiss Modernism',
    palette: [
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#1A1A1A', name: 'Ink' },
      { hex: '#E63329', name: 'Signal Red' },
      { hex: '#767676', name: 'Mid Grey' },
      { hex: '#F5F5F5', name: 'Off-White' },
    ],
    description: 'The discipline of the International Typographic Style: grid systems, precise proportion, and confident negative space. Timeless and authoritative, it anchors corporate communications, wayfinding systems, and design publications of every era.',
  },
  {
    tags: ['minimal', 'organic'],
    label: 'Zen Garden',
    palette: [
      { hex: '#F5F2EE', name: 'Rice Paper' },
      { hex: '#C8B8A2', name: 'Sand' },
      { hex: '#7A9E7E', name: 'Celadon' },
      { hex: '#E8D5B7', name: 'Warm Stone' },
      { hex: '#5C6B5A', name: 'Moss' },
    ],
    description: 'Stillness expressed through form. Influenced by Japanese aesthetics — wabi-sabi, ma, and kanso — this style uses natural materials, asymmetry, and restrained colour to evoke calm and presence. Perfect for wellness brands and mindful living.',
  },
  {
    tags: ['dark', 'bold'],
    label: 'Midnight Editorial',
    palette: [
      { hex: '#0D0D0D', name: 'Near Black' },
      { hex: '#1E1E1E', name: 'Charcoal' },
      { hex: '#F5F5F0', name: 'Cream' },
      { hex: '#C8A96E', name: 'Aged Gold' },
      { hex: '#4A4A4A', name: 'Graphite' },
    ],
    description: 'Deep blacks, controlled tension, and a single warm highlight — the visual language of high-end editorial and luxury print. Commanding yet restrained, this aesthetic suits fashion, architecture, and premium brand identity work.',
  },
  {
    tags: ['delicate', 'organic'],
    label: 'Botanical Line',
    palette: [
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#8BAF8E', name: 'Leaf Green' },
      { hex: '#C4B5A5', name: 'Parchment' },
      { hex: '#4A6741', name: 'Forest' },
      { hex: '#E8D5C0', name: 'Pale Blush' },
    ],
    description: 'Fine linework traces the architecture of leaf and petal against breathable grounds. Restrained, precise yet inherently poetic, this style is favoured in luxury packaging, natural beauty brands, and high-end publishing.',
  },
  {
    tags: ['playful', 'bold'],
    label: 'Pop Punch',
    palette: [
      { hex: '#FF3366', name: 'Hot Pink' },
      { hex: '#FFCC00', name: 'Vivid Yellow' },
      { hex: '#00CCFF', name: 'Cyan' },
      { hex: '#1A1A1A', name: 'Ink' },
      { hex: '#F8F8F8', name: 'White' },
    ],
    description: 'Saturated, energetic, and impossible to ignore. Bold shapes meet vibrant colour in a style that draws equally from screen-printing and street culture. A natural fit for youth brands, activations, and fast-moving consumer campaigns.',
  },

  // ── Three-tag profiles (core combinations) ───────────────────────────────
  {
    tags: ['geometric', 'bold', 'minimal'],
    label: 'Bauhaus Geometric',
    palette: [
      { hex: '#E63329', name: 'Primary Red' },
      { hex: '#1A1A2E', name: 'Ink Navy' },
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#0074D9', name: 'Primary Blue' },
      { hex: '#F0C040', name: 'Primary Yellow' },
    ],
    description: 'Rooted in the Bauhaus tradition, this style strips form to its essentials — primary colours, clean geometry, and purposeful composition. It communicates with authority and clarity. Ideal for cultural institutions, editorial design, and design-forward brand identities.',
  },
  {
    tags: ['dark', 'textural', 'retro'],
    label: 'Dark Risograph',
    palette: [
      { hex: '#1C1C1C', name: 'Ink Black' },
      { hex: '#D94F3D', name: 'Risograph Red' },
      { hex: '#4A7C6F', name: 'Mineral Teal' },
      { hex: '#E8D5B0', name: 'Aged Paper' },
      { hex: '#2D2D5A', name: 'Deep Indigo' },
    ],
    description: 'Layered like a vintage risograph print, this aesthetic pairs earthy slightly-off tones with deep shadows and tactile grain. The beauty is in the misregistration — imperfection as intention. Perfect for zine culture, independent music, and handcrafted editorial.',
  },
  {
    tags: ['minimal', 'delicate', 'organic'],
    label: 'Soft Editorial',
    palette: [
      { hex: '#F2EDE4', name: 'Linen' },
      { hex: '#C4B5A5', name: 'Warm Taupe' },
      { hex: '#8A9E8C', name: 'Sage' },
      { hex: '#E8C9B0', name: 'Peach Stone' },
      { hex: '#6B7C6E', name: 'Dusty Green' },
    ],
    description: 'A refined, breathable aesthetic that favours white space, subtle earth tones, and flowing organic shapes. Every element earns its place. Well-suited to independent lifestyle publishing, contemporary illustration, and artisan beauty brands.',
  },
  {
    tags: ['retro', 'futuristic', 'bold'],
    label: 'Retro Futurism',
    palette: [
      { hex: '#FF6B35', name: 'Rocket Orange' },
      { hex: '#1B1B2F', name: 'Space Black' },
      { hex: '#E8D44D', name: 'Solar Yellow' },
      { hex: '#4ECDC4', name: 'Atomic Teal' },
      { hex: '#F7F7F7', name: 'Chrome White' },
    ],
    description: 'The future as imagined in the past — chrome finishes, bold typography, and saturated palettes inspired by 1960s–80s science fiction. Simultaneously nostalgic and visionary, it is a striking choice for tech-forward brands that want warmth alongside ambition.',
  },
  {
    tags: ['organic', 'textural', 'delicate'],
    label: 'Nature Print',
    palette: [
      { hex: '#5C7A4E', name: 'Fern' },
      { hex: '#C4A882', name: 'Raw Linen' },
      { hex: '#E8DDD0', name: 'Pale Stone' },
      { hex: '#8B6914', name: 'Ochre' },
      { hex: '#A8C4A2', name: 'Pale Sage' },
    ],
    description: 'Inspired by botanical illustration and woodblock printing, this style celebrates natural form with warm earth tones and hand-hewn texture. The grain is the point. Ideal for food, wellness, outdoor lifestyle brands, and slow-living editorial.',
  },
  {
    tags: ['futuristic', 'dark', 'bold'],
    label: 'Cyberpunk',
    palette: [
      { hex: '#0D0D0D', name: 'Void' },
      { hex: '#FF0080', name: 'Neon Magenta' },
      { hex: '#00FFFF', name: 'Cyan' },
      { hex: '#7B2FBE', name: 'Electric Violet' },
      { hex: '#1A1A2E', name: 'Deep Space' },
    ],
    description: 'High contrast, neon-drenched, and unapologetically intense. This style borrows from urban dystopia and digital subculture — every surface hums with electricity. Powerful for gaming, tech events, and avant-garde fashion campaigns.',
  },
  {
    tags: ['playful', 'minimal', 'geometric'],
    label: 'Playful Flat',
    palette: [
      { hex: '#FFD166', name: 'Butter Yellow' },
      { hex: '#06D6A0', name: 'Mint' },
      { hex: '#118AB2', name: 'Ocean Blue' },
      { hex: '#EF476F', name: 'Coral' },
      { hex: '#F8F9FA', name: 'Off-White' },
    ],
    description: 'Bright, cheerful, and unashamedly fun — this style uses flat geometry and a vivid palette to communicate with energy and instant clarity. Perfect for children\'s products, edtech, consumer apps, and anything that benefits from approachable friendliness.',
  },
  {
    tags: ['organic', 'delicate', 'retro'],
    label: 'Art Nouveau',
    palette: [
      { hex: '#6B4226', name: 'Walnut' },
      { hex: '#A8BF8A', name: 'Leaf' },
      { hex: '#D4AF6E', name: 'Gilt' },
      { hex: '#8C7B6E', name: 'Stone' },
      { hex: '#F0E6D3', name: 'Vellum' },
    ],
    description: 'Flowing lines, botanical motifs, and ornate detail evoke the turn-of-the-century romanticism of Mucha and Klimt. Sinuous form meets rich surface decoration. This style brings warmth and elegance to beauty, hospitality, and luxury goods.',
  },
  {
    tags: ['bold', 'geometric', 'dark'],
    label: 'Brutalist Graphic',
    palette: [
      { hex: '#1A1A1A', name: 'Black' },
      { hex: '#F5F5F5', name: 'White' },
      { hex: '#FF3300', name: 'Electric Red' },
      { hex: '#FFCC00', name: 'Caution Yellow' },
      { hex: '#333333', name: 'Dark Grey' },
    ],
    description: 'Raw, confrontational, and self-aware — brutalist graphic design rejects decoration in favour of structural honesty. It refuses to be invisible. Black, white, and a single electric accent dominate. Best for cultural institutions, experimental publishing, and provocative campaigns.',
  },
  {
    tags: ['playful', 'delicate', 'organic'],
    label: 'Pastel Whimsy',
    palette: [
      { hex: '#FFD6E0', name: 'Petal Pink' },
      { hex: '#C1E1C1', name: 'Mint Cream' },
      { hex: '#BDE0FE', name: 'Sky Blue' },
      { hex: '#FFEAA7', name: 'Lemon Curd' },
      { hex: '#E8DAEF', name: 'Lilac' },
    ],
    description: 'Soft gradients, rounded forms, and a dreamy pastel palette create an atmosphere of gentle wonder. Nothing is too sharp or too loud. This style suits stationery, children\'s content, wellness apps, and anything that aims to feel nurturing and joyful.',
  },
  {
    tags: ['textural', 'minimal', 'retro'],
    label: 'Ink & Paper',
    palette: [
      { hex: '#2C2416', name: 'Printer\'s Black' },
      { hex: '#E8E0D0', name: 'Antique White' },
      { hex: '#8B7355', name: 'Warm Brown' },
      { hex: '#C4B99A', name: 'Aged Ivory' },
      { hex: '#4A3728', name: 'Espresso' },
    ],
    description: 'The tactile warmth of letterpress and linocut — deliberate imperfection, cream grounds, and the weight of ink on textured stock. Excellent for independent publishing, artisan food brands, heritage crafts, and anyone who values the handmade.',
  },
  {
    tags: ['minimal', 'futuristic', 'geometric'],
    label: 'Digital Minimal',
    palette: [
      { hex: '#F8F9FA', name: 'Interface White' },
      { hex: '#212529', name: 'Near Black' },
      { hex: '#4361EE', name: 'Electric Blue' },
      { hex: '#E9ECEF', name: 'Light Grey' },
      { hex: '#ADB5BD', name: 'Mid Grey' },
    ],
    description: 'Clean, systematic, and quietly forward-thinking. Generous whitespace, precise geometry, and a restrained accent colour signal intelligence without ostentation. Ideal for SaaS products, fintech, healthcare technology, and serious editorial design.',
  },
  {
    tags: ['organic', 'delicate', 'playful'],
    label: 'Cottagecore',
    palette: [
      { hex: '#C5D5B5', name: 'Meadow' },
      { hex: '#E8D5C0', name: 'Warm Linen' },
      { hex: '#A67B5B', name: 'Clay' },
      { hex: '#8FAF7E', name: 'Herb Green' },
      { hex: '#F2EDE4', name: 'Cream' },
    ],
    description: 'Wildflowers, linen textures, and the soft palette of a sun-dappled garden. Cottagecore channels slowness and craft, celebrating seasonal rhythms and domestic joy. A natural fit for food, lifestyle media, independent retail, and slow-living brands.',
  },
  {
    tags: ['dark', 'textural', 'bold'],
    label: 'Industrial Grunge',
    palette: [
      { hex: '#2A2A2A', name: 'Gunmetal' },
      { hex: '#5C5C5C', name: 'Steel' },
      { hex: '#C14B2A', name: 'Oxide Red' },
      { hex: '#A0A0A0', name: 'Aluminium' },
      { hex: '#1A1A1A', name: 'Charcoal' },
    ],
    description: 'Exposed metal, worn concrete, and the gritty texture of industrial spaces. Deep neutrals punctuated by rust and oxide tones create a raw, uncompromising energy. Suited to streetwear, independent music, construction brands, and urban architecture.',
  },

  // ── Four-tag profiles (specific combinations) ────────────────────────────
  {
    tags: ['organic', 'playful', 'retro', 'textural'],
    label: 'Folk Illustration',
    palette: [
      { hex: '#D95C2B', name: 'Terracotta' },
      { hex: '#4A7C3F', name: 'Forest' },
      { hex: '#F0C84A', name: 'Harvest Yellow' },
      { hex: '#2C4A8C', name: 'Indigo' },
      { hex: '#F5E6CC', name: 'Parchment' },
    ],
    description: 'Hand-drawn charm meets bold folk pattern — woodcuts, embroidery, and indigenous textile motifs. Vibrant, warm, and wonderfully idiosyncratic, this aesthetic tells stories through image in a way that feels deeply human and culturally rich.',
  },
  {
    tags: ['geometric', 'playful', 'bold', 'retro'],
    label: 'Memphis Pop',
    palette: [
      { hex: '#FF6B6B', name: 'Tomato' },
      { hex: '#FFE66D', name: 'Lemon' },
      { hex: '#4ECDC4', name: 'Aqua' },
      { hex: '#95E1D3', name: 'Pale Teal' },
      { hex: '#2C2C54', name: 'Deep Purple' },
    ],
    description: 'Squiggles, zigzags, and an exuberant collision of pattern and colour — the Memphis Group brought forward to today. Energetic and irreverent, it refuses to take itself too seriously. Shines in branding aimed at younger, style-conscious audiences.',
  },
  {
    tags: ['futuristic', 'playful', 'dark', 'retro'],
    label: 'Vaporwave',
    palette: [
      { hex: '#FF71CE', name: 'Hot Pink' },
      { hex: '#01CDFE', name: 'Sky Cyan' },
      { hex: '#05FFA1', name: 'Matrix Green' },
      { hex: '#B967FF', name: 'Neon Purple' },
      { hex: '#1A1A2E', name: 'Night' },
    ],
    description: 'Nostalgia distorted through a digital lens — pastel neons, glitch aesthetics, and the grid-and-chrome iconography of early computing. Vaporwave is simultaneously ironic and sincere, making it ideal for music, internet-native brands, and youth culture campaigns.',
  },
  {
    tags: ['dark', 'futuristic', 'textural', 'bold'],
    label: 'Neon Noir',
    palette: [
      { hex: '#0A0A0F', name: 'Abyss' },
      { hex: '#FF2D78', name: 'Neon Crimson' },
      { hex: '#1AFFD5', name: 'Laser Teal' },
      { hex: '#8833FF', name: 'Ultraviolet' },
      { hex: '#1C1C2E', name: 'Midnight Blue' },
    ],
    description: 'Wet streets reflecting neon, shadows cut with colour, darkness that hums with electricity. Neon noir fuses cinematic atmosphere with digital intensity. A compelling choice for nightlife, gaming, speculative fiction, and fashion photography.',
  },

  // ── Single-focus profiles (decisive edge cases) ──────────────────────────
  {
    tags: ['futuristic', 'minimal', 'bold'],
    label: 'Kinetic Tech',
    palette: [
      { hex: '#050A14', name: 'Deep Black' },
      { hex: '#0066FF', name: 'Signal Blue' },
      { hex: '#E0E8FF', name: 'Ghost White' },
      { hex: '#003399', name: 'Navy' },
      { hex: '#FFFFFF', name: 'White' },
    ],
    description: 'The visual language of computational precision — deep blue-blacks, electric blue accents, and crisp white type on a field that suggests motion and processing. Authoritative and progressive, suited to AI, engineering, and enterprise technology.',
  },
  {
    tags: ['retro', 'bold', 'playful'],
    label: 'Vintage Pop',
    palette: [
      { hex: '#E8371B', name: 'Cherry Red' },
      { hex: '#F5C842', name: 'Sunflower' },
      { hex: '#2255A4', name: 'Cobalt' },
      { hex: '#F5F0E0', name: 'Cream' },
      { hex: '#1A1A1A', name: 'Ink' },
    ],
    description: 'Bold halftone dots, punchy primary palettes, and the exuberant optimism of mid-century commercial art. Vintage pop is instantly recognisable and joyfully nostalgic, working beautifully for food and beverage, live events, and retro-leaning fashion labels.',
  },
  {
    tags: ['delicate', 'futuristic', 'minimal'],
    label: 'Gossamer UI',
    palette: [
      { hex: '#F0F4FF', name: 'Ice White' },
      { hex: '#C8D4F0', name: 'Pale Blue' },
      { hex: '#8A9CC0', name: 'Slate' },
      { hex: '#E8EEF8', name: 'Frost' },
      { hex: '#4A5870', name: 'Cool Grey' },
    ],
    description: 'Ultra-light, almost ethereal — near-white palettes, hairline rules, and barely-there gradients create an interface that feels advanced and deeply refined. Ideal for luxury digital products, premium fintech, and design-forward SaaS platforms.',
  },
  {
    tags: ['bold', 'playful', 'textural'],
    label: 'Street Art',
    palette: [
      { hex: '#1A1A1A', name: 'Pitch Black' },
      { hex: '#FF4136', name: 'Spray Red' },
      { hex: '#FFDC00', name: 'Tag Yellow' },
      { hex: '#2ECC40', name: 'Street Green' },
      { hex: '#0074D9', name: 'Cobalt' },
    ],
    description: 'The energy of the city wall — layered spray, wheat-paste collage, and thick marker line. Spontaneous yet crafted, this style commands attention and carries cultural weight. Powerful for activations, youth brands, social campaigns, and music.',
  },
];

/**
 * Matches a set of user-selected tags to the best-fit style profile.
 *
 * Score = matchCount + (matchCount / profileTagCount)
 * — specificity: more matched tags wins
 * — precision:   profiles where all defined tags match beat partial matches
 *
 * @param {string[]} tags — all currently selected tag strings
 * @returns {object|null} — a style profile, or null if no tags provided
 */
export function getStyleFromTags(tags) {
  if (!tags || tags.length === 0) return null;

  const tagSet = new Set(tags.map(t => t.toLowerCase().trim()));

  let best = null;
  let bestScore = 0;

  for (const profile of STYLE_PROFILES) {
    const matchCount = profile.tags.filter(t => tagSet.has(t)).length;
    if (matchCount === 0) continue;
    const score = matchCount + matchCount / profile.tags.length;
    if (score > bestScore) {
      bestScore = score;
      best = profile;
    }
  }

  // No preset-tag overlap (user has only custom tags) — return a neutral style
  if (!best) {
    return {
      label: 'Contemporary Direction',
      palette: [
        { hex: '#1A1A1A', name: 'Ink' },
        { hex: '#F5F5F5', name: 'White' },
        { hex: '#9CA3AF', name: 'Mid Grey' },
        { hex: '#E5E7EB', name: 'Light Grey' },
        { hex: '#6B7280', name: 'Cool Grey' },
      ],
      description: `A custom aesthetic built around "${tags.join('", "')}" — a considered, contemporary direction shaped by deliberate choices. Clarity, intent, and restrained composition guide the approach, making it adaptable across editorial, digital, and brand contexts.`,
    };
  }

  return best;
}
