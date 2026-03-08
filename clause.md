# Illustration Style Explorer

A React application that helps users explore and define illustration styles through:

- **Preset tags**: Clickable adjective tags for common style descriptors
- **Custom tags**: User-defined adjectives added via text input
- **Image analysis**: Upload an image and use Claude AI to extract style descriptors and color palettes

The app uses the Anthropic API (claude-sonnet-4-20250514) to:
1. Analyze uploaded images and extract style descriptors + color palettes
2. Generate style direction labels and descriptions from selected tags
