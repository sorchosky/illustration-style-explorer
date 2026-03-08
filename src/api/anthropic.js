import Anthropic from '@anthropic-ai/sdk';

function getClient() {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'REACT_APP_ANTHROPIC_API_KEY is not set. Add it to your .env file.'
    );
  }
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function parseJSONResponse(text) {
  const cleaned = text.trim();

  // Try JSON code block first
  const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1].trim()); } catch {}
  }

  // Try extracting bare JSON object
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch {}
  }

  // Try direct parse
  try { return JSON.parse(cleaned); } catch {}

  throw new Error('Could not parse JSON from API response.');
}

/**
 * Analyzes an image and extracts style tags and a color palette.
 * @param {string} base64Data - Base64-encoded image data (no data URL prefix)
 * @param {string} mediaType  - MIME type, e.g. "image/jpeg"
 * @returns {{ styleTags: string[], colorPalette: { hex: string, name: string }[] }}
 */
export async function analyzeImage(base64Data, mediaType) {
  const client = getClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-0',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Data },
          },
          {
            type: 'text',
            text: `Analyze this image's visual and illustration style. Extract:
1. Style adjective tags (4–6 single-word descriptors, e.g. "minimal", "textural", "bold", "retro")
2. Color palette (4–5 characteristic or dominant colors)

Respond with ONLY valid JSON, no other text:
{
  "styleTags": ["tag1", "tag2", "tag3", "tag4"],
  "colorPalette": [
    {"hex": "#XXXXXX", "name": "Color Name"},
    {"hex": "#XXXXXX", "name": "Color Name"}
  ]
}`,
          },
        ],
      },
    ],
  });

  return parseJSONResponse(response.content[0].text);
}

/**
 * Generates a style direction from the combined set of tags.
 * @param {string[]} tags           - All active style descriptors
 * @param {Array|null} imageContext - Color palette extracted from an uploaded image
 * @returns {{ colorPalette: Array, styleLabel: string, description: string }}
 */
export async function generateStyleOutput(tags, imageContext = null) {
  const client = getClient();

  const tagsList = tags.length > 0 ? tags.join(', ') : 'no specific tags selected';
  const contextStr = imageContext
    ? `\nReference image palette: ${imageContext.map(c => `${c.name} (${c.hex})`).join(', ')}`
    : '';

  const prompt = `You are a creative direction expert specializing in illustration and visual design.

Generate a style direction based on these aesthetic descriptors: ${tagsList}${contextStr}

Provide:
1. A color palette of 4–5 colors that best suit this style
2. A concise style direction label (1–4 words, like "Bauhaus Geometric", "Dark Risograph", "Soft Editorial Minimal")
3. A 2–3 sentence description of the style: its visual characteristics, mood, and where it might be applied

Respond with ONLY valid JSON, no other text:
{
  "colorPalette": [
    {"hex": "#XXXXXX", "name": "Color Name"},
    {"hex": "#XXXXXX", "name": "Color Name"},
    {"hex": "#XXXXXX", "name": "Color Name"},
    {"hex": "#XXXXXX", "name": "Color Name"},
    {"hex": "#XXXXXX", "name": "Color Name"}
  ],
  "styleLabel": "Style Direction Name",
  "description": "2–3 sentences describing this style direction."
}`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseJSONResponse(response.content[0].text);
}
