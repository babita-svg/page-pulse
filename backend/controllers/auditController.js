const { fetchAndParsePage } = require('../services/pageService');
const { isValidUrl } = require('../utils/validator');

async function runAudit(req, res) {
  try {
    const { url } = req.body;

    // 1. Validate Input Presence & Format
    if (!url) {
      return res.status(400).json({ error: 'URL field is required.' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL. Please include standard protocol (http:// or https://).' });
    }

    // 2. Fetch and Parse
    const report = await fetchAndParsePage(url);
    return res.status(200).json(report);

  } catch (error) {
    // 3. Handle specific operational errors gracefully
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timed out while trying to reach the target URL.' });
    }

    if (error.code === 'ENOTFOUND') {
      return res.status(404).json({ error: 'Domain name could not be resolved. Check the URL and try again.' });
    }

    return res.status(500).json({
      error: error.message || 'An unexpected error occurred while auditing the web page.'
    });
  }
}

module.exports = { runAudit };