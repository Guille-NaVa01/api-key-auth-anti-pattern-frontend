# Frontend App — `x-api-key` Anti-Pattern Exercise

A plain HTML/CSS/JavaScript page (no build step, no framework) that consumes
the companion [Backend API](../backend-api) and demonstrates sending a
static `x-api-key` header from the browser.

## Running it

No dependencies to install. Just serve the folder statically, for example:

```bash
python -m http.server 5500
```

Then open `http://127.0.0.1:5500` in your browser.

Alternatively, just double-click `index.html` to open it directly (some
browsers restrict `fetch` on `file://` pages, so a local server is
recommended).

Make sure the backend is running first (see `../backend-api/README.md`),
and that the **Backend base URL** and **API key** fields on the page match
your backend's address and configured key.

## Files

- `index.html` — page structure: title, the two buttons, and the response area.
- `styles.css` — all styling, kept out of the HTML.
- `app.js` — uses `fetch()` to call the backend and attaches the `x-api-key`
  header on every protected request.

## What to look at

1. Open your browser's DevTools → **Network** tab before clicking any
   button.
2. Click **Get Protected Data** or **Send POST Request** — inspect the
   outgoing request and note the `x-api-key` header is sent in plain text,
   visible to anyone who can see the request (browser, proxy, extension,
   etc.).
3. Try changing the key in the input field to something wrong and click a
   button again to see the `401 Unauthorized` response rendered in the
   Response box.

## Note on repository structure

This frontend is meant to live in its **own** GitHub repository, separate
from the backend API repository — they are two independent projects that
only communicate over HTTP.

This is the core lesson of the exercise: a secret that has to be known by
client-side code cannot really stay secret. See the backend's README for a
fuller discussion of why this pattern is weak and what to use instead.
