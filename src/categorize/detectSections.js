/**
 * Detects major layout sections in the page
 * @param {import('cheerio').CheerioAPI} $ - Cheerio instance
 * @returns {Array<{type: string, selector: string}>} - Array of section objects
 */
export function detectSections($) {
  const sections = [];

  // Navigation sections
  const navSelectors = ['nav', '#navbar', '[role="navigation"]', '[class*="nav"]', '[class*="Nav"]', 'header nav'];
  for (const selector of navSelectors) {
    if ($(selector).length > 0) {
      sections.push({ type: "nav", selector });
      break; // Only add first match
    }
  }

  // Hero sections
  const heroSelectors = ['[class*="hero"]', '[class*="Hero"]', '[id*="hero"]', '[id*="Hero"]', '[class*="banner"]', '[class*="Banner"]'];
  for (const selector of heroSelectors) {
    if ($(selector).length > 0) {
      sections.push({ type: "hero", selector });
      break;
    }
  }

  // Footer sections
  const footerSelectors = ['footer', '#footer', '[class*="footer"]', '[class*="Footer"]'];
  for (const selector of footerSelectors) {
    if ($(selector).length > 0) {
      sections.push({ type: "footer", selector });
      break;
    }
  }

  // Sidebar sections
  const sidebarSelectors = ['aside', '[class*="sidebar"]', '[class*="Sidebar"]', '[id*="sidebar"]', '[id*="Sidebar"]'];
  for (const selector of sidebarSelectors) {
    if ($(selector).length > 0) {
      sections.push({ type: "sidebar", selector });
      break;
    }
  }

  // Card list / Grid sections
  const cardListSelectors = ['[class*="card-list"]', '[class*="CardList"]', '[class*="grid"]', '[class*="Grid"]', '[class*="gallery"]', '[class*="Gallery"]'];
  for (const selector of cardListSelectors) {
    if ($(selector).length > 0) {
      sections.push({ type: "card_list", selector });
      break;
    }
  }

  // Form sections
  const formSelectors = ['form', '[class*="form"]', '[class*="Form"]'];
  for (const selector of formSelectors) {
    if ($(selector).length > 0) {
      sections.push({ type: "form", selector });
      break;
    }
  }

  // Main content sections
  const contentSelectors = ['main', '[role="main"]', '[class*="content"]', '[class*="Content"]', '[id*="content"]', '[id*="Content"]', 'article'];
  for (const selector of contentSelectors) {
    if ($(selector).length > 0) {
      sections.push({ type: "content", selector });
      break;
    }
  }

  // If no sections found, return empty array
  return sections;
}

