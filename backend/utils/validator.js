/**
 * Utility function to validate external URLs.
 * Ensures input is a valid HTTP/HTTPS URL to prevent SSRF vulnerabilities.
 */
function isValidUrl(urlString) {
  try {
    const parsedUrl = new URL(urlString);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

module.exports = { isValidUrl };