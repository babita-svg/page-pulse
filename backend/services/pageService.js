const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetches page content and parses basic SEO metrics.
 * Handled gracefully to prevent unhandled promise rejections or backend crashes.
 */
async function fetchAndParsePage(url) {
  const startTime = Date.now();

  // Request external page with a strict timeout to prevent hangs
  const response = await axios.get(url, {
    timeout: 5000,
    headers: {
      'User-Agent': 'PagePulse-AuditBot/1.0 (+https://digitalheroesco.com)',
      'Accept': 'text/html,application/xhtml+xml,application/xml'
    },
    maxRedirects: 3,
    validateStatus: (status) => status < 500 // Allow handling 4xx status codes cleanly
  });

  const responseTimeMs = Date.now() - startTime;
  const contentType = response.headers['content-type'] || '';

  // Ensure content is HTML before parsing
  if (!contentType.includes('text/html')) {
    throw new Error(`Target URL returned non-HTML content (${contentType || 'Unknown type'})`);
  }

  const parsedData = parsePage(response.data);

  return {
    status: response.status,
    responseTimeMs,
    ...parsedData
  };
}

/**
 * Pure function to extract SEO details from HTML content.
 * Abstracted for fast, isolated unit testing.
 */
function parsePage(html) {
  if (!html || typeof html !== 'string') {
    return {
      title: 'No title',
      metaDescription: 'No meta description',
      h1Count: 0,
      imagesMissingAlt: 0,
      wordCount: 0
    };
  }

  const $ = cheerio.load(html);

  // 1. Extract Page Title
  const title = $('title').text().trim() || 'No title';

  // 2. Extract Meta Description
  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    'No meta description';

  // 3. Count H1 Headers
  const h1Count = $('h1').length;

  // 4. Count images without alt tags (or empty alt attributes)
  let imagesMissingAlt = 0;
  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt.trim() === '') {
      imagesMissingAlt++;
    }
  });

  // 5. Calculate approximate word count in body
  // Strip out script, style, and navigation noise to get readable text length
  $('script, style, noscript, svg').remove();
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText ? bodyText.split(' ').filter(Boolean).length : 0;

  return {
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount
  };
}

module.exports = {
  fetchAndParsePage,
  parsePage
};