/**
 * Detects the page type using heuristics
 * @param {import('cheerio').CheerioAPI} $ - Cheerio instance
 * @returns {string} - Page type: "search" | "product" | "list" | "article" | "login" | "home" | "unknown"
 */
export function detectPageType($) {
  // Search Page heuristics
  const searchInput = $('input[type="search"]').length;
  const submitButton = $('button[type="submit"]').length;
  const productLinks = $('a[href*="product"], a[href*="item"], a[href*="/p/"]').length;
  
  if (searchInput > 0 && (submitButton > 0 || productLinks > 5)) {
    return "search";
  }

  // Product Page heuristics
  const priceSelectors = $('[class*="price"], [class*="Price"], [id*="price"], [id*="Price"], [data-price]').length;
  const mainProductImage = $('img[class*="product"], img[class*="Product"], img[id*="product"], img[id*="Product"]').length;
  
  // Check for add-to-cart buttons by class/id and text content
  let addToCartButton = $('[class*="add-to-cart"], [class*="addToCart"], [id*="add-to-cart"], [id*="addToCart"]').length;
  if (addToCartButton === 0) {
    // Check button text manually
    $('button').each((_, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes('add to cart') || text.includes('buy now') || text.includes('purchase')) {
        addToCartButton++;
      }
    });
  }
  
  if ((priceSelectors > 0 || mainProductImage > 0) && addToCartButton > 0) {
    return "product";
  }

  // Login Page heuristics
  const forms = $('form').length;
  const passwordFields = $('input[type="password"]').length;
  
  if (forms > 0 && passwordFields > 0) {
    return "login";
  }

  // Article / Content Page heuristics
  const paragraphs = $('p').length;
  const h1 = $('h1').length;
  const authorPatterns = $('[class*="author"], [class*="Author"], [class*="byline"], [class*="Byline"]').length;
  const datePatterns = $('[class*="date"], [class*="Date"], [class*="published"], [class*="Published"], time[datetime]').length;
  
  if (paragraphs > 5 && h1 > 0 && (authorPatterns > 0 || datePatterns > 0)) {
    return "article";
  }

  // List Page heuristics
  const cardElements = $('[class*="card"], [class*="Card"], [class*="item"], [class*="Item"]').length;
  const repeatedStructures = $('article, [role="article"]').length;
  
  if (cardElements > 3 || repeatedStructures > 3) {
    return "list";
  }

  // Home Page heuristics (fallback if has hero section and nav)
  const heroSections = $('[class*="hero"], [class*="Hero"], [id*="hero"], [id*="Hero"]').length;
  const navElements = $('nav, [role="navigation"], [class*="nav"], [class*="Nav"]').length;
  
  if (heroSections > 0 && navElements > 0 && paragraphs < 5) {
    return "home";
  }

  return "unknown";
}

