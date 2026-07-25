# Page Pulse

A lightweight web tool that audits any public URL and returns a clean report:
HTTP status, response time, page title, meta description, H1 count, images
missing alt text, and approximate word count.

**Live:** https://page-pulse-rose.vercel.app
**Built for:** Digital Heroes SDE Internship — Task A & B

---

## Setup

\`\`\`bash
git clone <https://github.com/babita-svg/page-pulse>
cd page-pulse
npm install
npm run dev
\`\`\`

Runs locally at https://page-pulse-gz9i.onrender.com

No environment variables or API keys required — the tool fetches pages
server-side and parses the response directly.

---

## API Contract

**POST** `/api/audit`

**Request body:**
\`\`\`json
{ "url": "https://example.com" }
\`\`\`

**Success response — 200:**
\`\`\`json
{
  "status": 200,
  "responseTimeMs": 342,
  "title": "Example Domain",
  "metaDescription": "An example page used for illustrative purposes.",
  "h1Count": 1,
  "imagesMissingAlt": 3,
  "wordCount": 218
}
\`\`\`

**Error response — 400 (invalid URL) / 408 (timeout) / 422 (non-HTML content):**
\`\`\`json

  "error": "The requested URL could not be reached.",
  "status": 400


The endpoint never throws an unhandled exception — every failure path
returns a structured JSON error with an appropriate HTTP status code, so the
frontend can always render something meaningful instead of a blank crash.

---

## Design decisions

**1. Server-side fetching, not client-side.**
Auditing a URL from the browser hits CORS walls on most real sites. Doing
the fetch server-side (in the API route) sidesteps that entirely and also
means response-time measurement is accurate — it's timing the actual
server-to-server request, not a browser-mediated one.

**2. Structured error objects instead of thrown exceptions.**
Early on the parser threw raw errors on bad input, which meant one bad URL
could 500 the whole endpoint. I moved to a pattern where every failure
mode — invalid URL, timeout, non-HTML content-type — gets caught and
returned as a normal JSON object with an `error` field and correct status
code. The frontend never sees a crash, only a report it can render either
way.

**3. Word count is approximate by design, not a bug.**
Counting words after stripping HTML tags will always disagree slightly
with a manual count (script/style content, inline SVGs, and whitespace
collapsing all shift the number a little). Rather than chase an exact
count, I documented it as an approximation in the report itself, since
the tool's job is directional signal ("this page is thin"), not a
word-processor-grade count.

---

## What I'd change with another day

See the Loom walkthrough below — I talk through this live, but the short
version is: I'd move URL validation earlier (before the fetch call, not
after) to fail faster on obviously malformed input, and I'd add basic
caching so re-auditing the same URL twice in a short window doesn't
re-fetch it.