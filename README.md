# @threvo/website-understanding-sdk
### A Universal Website Perception Layer for Agents

Modern AI agents can think, plan, and reason —  
**but they cannot understand websites.**


## What This SDK Does

This SDK analyzes web pages and extracts structured, machine-readable JSON describing:
- **Page type** (search, product, list, article, login, home, unknown)
- **Key sections** (navigation, hero, footer, sidebar, card lists, forms, content)
- **Interactive elements** (buttons, links, inputs, images)
- **Layout hierarchy** (CSS selectors for all identified elements)
- **Metadata** (title, description, URL)

Perfect for building agents that need to understand and interact with web pages programmatically.

> **🧠 Think of this as the “eyes” and “spatial map” of your AI agent.**

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
import { analyzePage } from '@threvo/website-understanding-sdk';

// Analyze a URL (SSR mode - default)
const result = await analyzePage('https://example.com');

// Or analyze raw HTML
const html = '<html>...</html>';
const result = await analyzePage(html);
```

### Dynamic Mode (CSR / React / SPA Support)

For JavaScript-rendered websites (React, Next.js, Vue, SPAs), use dynamic mode:

```javascript
import { analyzePage } from '@threvo/website-understanding-sdk';

// Enable dynamic mode to render JavaScript before analysis
const result = await analyzePage("https://myntra.com", { dynamic: true });
```

**Notes:**
- Slower than SSR mode (requires browser rendering)
- Works on JS-rendered websites
- No interactions (only DOM snapshot)
- Automatically falls back to SSR mode if Playwright fails

### Example Output

```json
{
  "page_type": "product",
  "sections": [
    {
      "type": "nav",
      "selector": "nav"
    },
    {
      "type": "hero",
      "selector": "[class*=\"hero\"]"
    },
    {
      "type": "content",
      "selector": "main"
    },
    {
      "type": "footer",
      "selector": "footer"
    }
  ],
  "elements": {
    "inputs": [
      "#search-input",
      ".email-input",
      "input:nth-of-type(1)"
    ],
    "buttons": [
      "#add-to-cart",
      ".submit-btn",
      "button:nth-of-type(1)"
    ],
    "links": [
      "#logo",
      ".nav-link",
      "a:nth-of-type(1)"
    ],
    "images": [
      "#product-image",
      ".hero-image",
      "img:nth-of-type(1)"
    ]
  },
  "metadata": {
    "title": "Example Product Page",
    "description": "Buy amazing products here",
    "url": "https://example.com/product"
  }
}
```

## Page Type Detection

The SDK uses heuristics to detect page types:

- **Search**: Contains search input and multiple product/item links
- **Product**: Contains price selectors, product images, and add-to-cart buttons
- **Article**: Long paragraphs with H1 and author/date patterns
- **Login**: Forms with password fields
- **List**: Multiple repeated card-like elements
- **Home**: Hero sections with navigation
- **Unknown**: Fallback when no patterns match

## Section Detection

Identifies major layout areas:
- Navigation bars
- Hero sections
- Footers
- Sidebars
- Card grids/lists
- Forms
- Main content areas

## Element Extraction

Extracts CSS selectors for:
- **Inputs**: All form input elements
- **Buttons**: Button elements and elements with `role="button"`
- **Links**: All anchor tags with href attributes
- **Images**: All image elements

## Demo

Run the demo server:

```bash
npm run demo
```

Then open `http://localhost:3000` in your browser to use the interactive demo UI.

The demo provides:
- Modern dark-themed interface
- URL input field
- Real-time page analysis
- Pretty-printed JSON output

## API Endpoint

The demo server exposes an API endpoint:

```
GET /api/analyze?url=<your-url>&dynamic=true
```

**Parameters:**
- `url` (required): The URL to analyze
- `dynamic` (optional): Set to `true` to enable Playwright rendering for CSR websites

Returns the analysis result as JSON.

## Modes

### SSR Mode (Default)
- Fast and lightweight
- Uses axios + cheerio
- Works with server-side rendered content
- Best for static websites and SSR frameworks

### Dynamic Mode
- Renders JavaScript using Playwright
- Supports CSR websites (React, Next.js, Vue, SPAs)
- Slower but more comprehensive
- Automatically falls back to SSR mode on errors

## Limitations

- **Heuristic-Based**: Page type detection uses simple heuristics and may not be 100% accurate for all websites.

- **CSS Selector Generation**: Selectors are generated using simple heuristics (ID > class > tag name) and may not always be unique.

- **Dynamic Mode**: Only performs one-shot rendering. No interactions, clicks, or multi-step browsing.

## Roadmap for V2

- [x] **Playwright Integration**: Full JavaScript execution support for SPAs
- [ ] **Machine Learning**: ML-based page type classification
- [ ] **Enhanced Selectors**: More robust and unique CSS selector generation
- [ ] **Screenshot Analysis**: Visual layout understanding
- [ ] **Accessibility Analysis**: ARIA labels and accessibility features
- [ ] **Performance Metrics**: Page load time and performance data
- [ ] **Content Extraction**: Extract actual text content from sections
- [ ] **Form Field Analysis**: Detailed form field types and validation rules
- [ ] **Link Analysis**: Internal vs external link classification
- [ ] **Image Analysis**: Alt text and image context extraction

## Project Structure

```
/src
  analyzePage.js          # Main entry point
  fetchers/
    fetchDynamicHTML.js   # Playwright-based HTML fetcher
  categorize/
    detectPageType.js     # Page type detection
    detectSections.js     # Section detection
  extract/
    extractElements.js    # Element extraction
    extractMetadata.js    # Metadata extraction
/demo
  server.js              # Express demo server
  index.html             # Demo UI
package.json
README.md
```

## License

MIT

