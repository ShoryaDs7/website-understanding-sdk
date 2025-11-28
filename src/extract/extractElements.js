/**
 * Extracts interactive and key elements from the page
 * @param {import('cheerio').CheerioAPI} $ - Cheerio instance
 * @returns {{inputs: string[], buttons: string[], links: string[], images: string[]}} - Object with arrays of CSS selectors
 */
export function extractElements($) {
  const elements = {
    inputs: [],
    buttons: [],
    links: [],
    images: []
  };

  // Extract input elements
  $('input').each((_, el) => {
    const selector = generateSelector($, el);
    if (selector) {
      elements.inputs.push(selector);
    }
  });

  // Extract button elements
  $('button, [role="button"]').each((_, el) => {
    const selector = generateSelector($, el);
    if (selector) {
      elements.buttons.push(selector);
    }
  });

  // Extract link elements
  $('a[href]').each((_, el) => {
    const selector = generateSelector($, el);
    if (selector) {
      elements.links.push(selector);
    }
  });

  // Extract image elements
  $('img').each((_, el) => {
    const selector = generateSelector($, el);
    if (selector) {
      elements.images.push(selector);
    }
  });

  return elements;
}

/**
 * Generates a CSS selector for an element
 * @param {import('cheerio').CheerioAPI} $ - Cheerio instance
 * @param {any} element - Cheerio element
 * @returns {string} - CSS selector
 */
function generateSelector($, element) {
  const $el = $(element);
  
  // Prefer ID selector
  const id = $el.attr('id');
  if (id) {
    return `#${id}`;
  }

  // Use class selector
  const classes = $el.attr('class');
  if (classes) {
    const classList = classes.split(/\s+/).filter(c => c.length > 0);
    if (classList.length > 0) {
      return `.${classList[0]}`;
    }
  }

  // Use tag name with index as fallback
  const tagName = $el.prop('tagName')?.toLowerCase();
  if (tagName) {
    // Get all elements of this tag and find index
    const allSameTag = $(tagName);
    let index = 1;
    allSameTag.each((i, elem) => {
      if (elem === element) {
        index = i + 1;
        return false; // break
      }
    });
    return `${tagName}:nth-of-type(${index})`;
  }

  return tagName || 'unknown';
}

