/**
 * Extracts metadata from the page
 * @param {import('cheerio').CheerioAPI} $ - Cheerio instance
 * @param {string} url - The URL of the page
 * @returns {{title: string | null, description: string | null, url: string}} - Metadata object
 */
export function extractMetadata($, url) {
  // Extract title
  let title = $('title').text() || null;
  if (!title) {
    title = $('h1').first().text() || null;
  }
  if (title) {
    title = title.trim();
  }

  // Extract meta description
  let description = $('meta[name="description"]').attr('content') || null;
  if (!description) {
    description = $('meta[property="og:description"]').attr('content') || null;
  }
  if (description) {
    description = description.trim();
  }

  return {
    title,
    description,
    url: url || null
  };
}

