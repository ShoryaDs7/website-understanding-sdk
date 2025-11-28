import axios from 'axios';
import * as cheerio from 'cheerio';
import { detectPageType } from './categorize/detectPageType.js';
import { detectSections } from './categorize/detectSections.js';
import { extractElements } from './extract/extractElements.js';
import { extractMetadata } from './extract/extractMetadata.js';
import { fetchDynamicHTML } from './fetchers/fetchDynamicHTML.js';

/**
 * Analyzes a web page and returns structured JSON
 * @param {string} input - URL (starting with http/https) or raw HTML string
 * @param {Object} options - Analysis options
 * @param {boolean} options.dynamic - If true, use Playwright to render JavaScript (default: false)
 * @returns {Promise<{page_type: string, sections: Array, elements: Object, metadata: Object}>} - Analysis result
 */
export async function analyzePage(input, options = {}) {
  const { dynamic = false } = options;
  let html = '';
  let finalUrl = null;

  try {
    // Check if input is a URL
    if (input.startsWith('http://') || input.startsWith('https://')) {
      // Use dynamic mode (Playwright) if requested
      if (dynamic) {
        try {
          html = await fetchDynamicHTML(input);
          finalUrl = input;
        } catch (error) {
          // Fallback to SSR mode if Playwright fails
          console.warn('Playwright fetch failed, falling back to SSR mode:', error.message);
          const response = await axios.get(input, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            maxRedirects: 5,
            timeout: 10000
          });
          html = response.data;
          finalUrl = response.request.res.responseUrl || input;
        }
      } else {
        // Use SSR mode (axios + cheerio)
        const response = await axios.get(input, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          maxRedirects: 5,
          timeout: 10000
        });
        html = response.data;
        finalUrl = response.request.res.responseUrl || input;
      }
    } else {
      // Treat as raw HTML
      html = input;
    }

    // Load HTML into cheerio
    const $ = cheerio.load(html);

    // Run all detectors
    const page_type = detectPageType($) || "unknown";
    const sections = detectSections($) || [];
    const elements = extractElements($) || {
      inputs: [],
      buttons: [],
      links: [],
      images: []
    };
    const metadata = extractMetadata($, finalUrl) || {
      title: null,
      description: null,
      url: null
    };

    // Return structured JSON
    return {
      page_type,
      sections,
      elements,
      metadata
    };
  } catch (error) {
    // Return safe defaults on error - never throw
    return {
      page_type: "unknown",
      sections: [],
      elements: {
        inputs: [],
        buttons: [],
        links: [],
        images: []
      },
      metadata: {
        title: null,
        description: null,
        url: null
      }
    };
  }
}

