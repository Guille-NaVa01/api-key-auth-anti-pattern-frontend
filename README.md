# Frontend App — `x-api-key` Anti-Pattern Exercise (Nginx Edition)

A plain HTML/CSS/JavaScript page served by **Nginx inside Docker**, which acts as a
reverse proxy to the companion [Backend API](https://github.com/Guille-NaVa01/api-key-auth-anti-pattern-backend).

## Architecture

```
Browser ──► Nginx :80 ──► inject x-api-key (server-side) ──► Backend :8000
                └── serves static files (HTML / CSS / JS)
```

The API key **never appears in browser-side code**. It lives in a `.env` file on your
machine and is injected by Nginx into each proxied request — invisible in DevTools,
the page source, and network traffic.

## Running it

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- The backend running locally on port **8000**
  (see the [backend repo](https://github.com/Guille-NaVa01/api-key-auth-anti-pattern-backend))

### Steps

1. **Create your `.env` file** (gitignored — never committed):

   ```bash
   cp .env.example .env
   ```

   Open `.env` and set the real key:

   ```
   API_KEY=supersecret-demo-key-123
   ```

2. **Open docker:**

3. **Start the container:**

   ```bash
   docker compose up --build
   ```

4. **Open the app:**  <http://localhost>

To stop: `docker compose down`

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure: title, buttons, response area |
| `styles.css` | All styling |
| `app.js` | `fetch()` calls to Nginx — **no API key** |
| `Dockerfile` | Builds the `nginx:alpine` image |
| `compose.yml` | Docker Compose service definition |
| `nginx/nginx.conf` | Static serving + `/api/` reverse proxy with key injection |
| `nginx/entrypoint.sh` | Substitutes `$API_KEY` into nginx.conf at startup |
| `.env.example` | Template for the required environment variable |
| `.gitignore` | Ensures `.env` is never committed |

## What to look at

1. Open **DevTools → Sources** and read `app.js` — no API key anywhere.
2. Open **DevTools → Network**, click **Get Protected Data** or **Send POST Request**.
3. Inspect the outgoing request to `/api/data` — the `x-api-key` header is **absent**
   from the browser's view of the request (Nginx adds it after it leaves the browser).
4. The response box still shows the protected data (200 OK), proving the key reached
   the backend — just not through the browser.

## Note on repository structure

This frontend lives in its own GitHub repository, separate from the backend.
The two projects communicate only over HTTP — the frontend never needs the raw key.

This is the improved pattern: move secrets to the server side. Even so, note that
Nginx-injected headers can still be read by anyone with access to the Nginx config or
the `.env` file — proper secret management (e.g. Docker Secrets, a Vault) is the
next layer of defence.

