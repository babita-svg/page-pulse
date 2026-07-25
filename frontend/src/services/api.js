// Replace the top line with this:
const API_BASE_URL = 'https://page-pulse-gz9i.onrender.com/api';

export async function auditUrl(url) {
  const response = await fetch(`${API_BASE_URL}/audit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze page');
  }

  return data;
}