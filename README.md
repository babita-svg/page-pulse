# Page Pulse

A lightweight web tool that audits any public URL and returns a clean report:
HTTP status, response time, page title, meta description, H1 count, images
missing alt text, and approximate word count.

**Frontend:** https://page-pulse-rose.vercel.app
**Backend API:** https://page-pulse-gz9i.onrender.com
**Built for:** Digital Heroes SDE Internship — Task A & B

---

## Architecture

Split-service deployment: static frontend on Vercel, API backend on Render.
The frontend calls the Render backend over HTTPS for every audit request.

Note: Render's free tier spins down the service after inactivity, so the
first request after idle time can take 30–60 seconds to respond while the
instance cold-starts. This is expected — the Loom walkthrough calls it out
so it doesn't look like a bug.

---

## Setup
git clone main repo <https://github.com/babita-svg/page-pulse

**Backend:**
\`\`\`bash
git clone <https://github.com/babita-svg/page-pulse/tree/main/backend
cd page-pulse-backend
npm install
npm run dev
\`\`\`
Runs locally at `http://localhost:<port>`.

**Frontend:**
\`\`\`bash
git clone <https://github.com/babita-svg/page-pulse/tree/main/frontend
cd page-pulse-frontend
npm install
npm run dev
\`\`\`


API keys required — the tool fetches pages server-side and parses the
response .

---

## API Contract

**POST** `https://page-pulse-gz9i.onrender.com/api/audit`

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
{
  "error": "The requested URL could not be reached.",
  "status": 400
}
\`\`\`

The endpoint never throws an unhandled exception — every failure mode
returns structured JSON with an appropriate status code.

---

## Design decisions

**1. Split frontend/backend across Vercel and Render, not a single monolith.**
Vercel's serverless functions have execution time limits that don't play
well with slower page fetches (some target sites are just slow). Running
the actual audit logic on Render as a standalone Node/Express service
gives it a normal long-running process instead of a serverless timeout
ceiling, while the frontend stays static and fast on Vercel.

**2. Structured error objects instead of thrown exceptions.**
Every failure mode — invalid URL, timeout, non-HTML content-type — is
caught and returned as a normal JSON object with an `error` field and
correct status code, rather than letting the process throw. The frontend
never sees a raw crash, only a report it can render either way.

**3. Word count is approximate by design, not a bug.**
Counting words after stripping HTML tags will always disagree slightly
with a manual count. Documented as an approximation in the report itself
since the tool's job is directional signal, not exact measurement.

---

## What I'd change with another day

Talked through live in the Loom, but the short version: I'd add a loading
state on the frontend specifically for Render's cold-start delay, since
right now a first-request user just sees a blank wait with no feedback.
I'd also add basic caching so re-auditing the same URL twice in a short
window doesn't trigger a fresh fetch.