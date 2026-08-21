# Frontend App — API Key Anti-Pattern Exercise (React + Nginx)

A **React + Vite** frontend served by **Nginx inside Docker**. Nginx acts as a
reverse proxy to the [Backend API](https://github.com/Guille-NaVa01/api-key-auth-anti-pattern-backend),
injecting the `x-api-key` header **server-side** so it never appears in browser-side code.

## Architecture

```
Browser ──► Nginx :80 ──► inject x-api-key (server-side) ──► Backend :8000
                └── serves React build (dist/)
```

The API key **never appears in browser-side code**. It lives in a `.env` file on your
machine, is read by Docker Compose, and is injected into each proxied request by
`entrypoint.sh` at container startup — invisible in DevTools, page source, and network traffic.

## Running it

> **This project runs with Docker.** No Node.js installation required.

### Prerequisites

1. **Docker Desktop** — [download here](https://www.docker.com/products/docker-desktop/) and make sure it is **open and running** before the next steps.
2. **The backend** — must be running locally on port `8000`. See the [backend repo](https://github.com/Guille-NaVa01/api-key-auth-anti-pattern-backend) for instructions.

### Steps

**1. Clone this repo** (if you haven't already):



**2. Create the `.env` file** with the API key (this file is gitignored — it never gets committed):

```bash
cp .env.example .env
```

Then open `.env` and make sure it contains:

```
API_KEY=supersecret-demo-key-123
```

**3. Open Docker Desktop** and wait until it is fully started (the whale icon in the taskbar stops animating).

**4. Build and start the container:**

```bash
docker compose up --build
```

The first run downloads the Node.js and Nginx images — this takes a few minutes. Subsequent runs are much faster.

**5. Open the app in your browser:**

```
http://localhost
```

**To stop the container:**

```bash
docker compose down
```



## Files

| File / Folder | Purpose |
|---|---|
| `src/App.jsx` | Root React component — state, fetch logic, layout |
| `src/components/ApiTester.jsx` | URL input + GET/POST buttons |
| `src/components/ResponseViewer.jsx` | Terminal-style response panel |
| `src/App.css` | Dark cybersecurity UI styles |
| `src/index.css` | Global reset and CSS variables |
| `Dockerfile` | Multi-stage: Node build → Nginx serve |
| `compose.yml` | Docker Compose service definition |
| `nginx/nginx.conf` | Static serving + `/api/` reverse proxy with key injection |
| `nginx/entrypoint.sh` | Substitutes `$API_KEY` into nginx.conf at startup |
| `.env.example` | Template for the required environment variable |
| `.gitignore` | Ensures `.env` and `node_modules` are never committed |

## What to look at

1. Open **DevTools → Sources → src/App.jsx** — no `API_KEY` string anywhere.
2. Open **DevTools → Network**, click **GET /api/data** or **POST /api/data**.
3. Inspect the outgoing request — `x-api-key` header is **absent** from the browser's view.
4. The response panel still shows 200 OK with protected data — the key reached the backend,
   just not through the browser.

## Note on repository structure

This frontend lives in its own GitHub repository, separate from the backend.
The two projects communicate only over HTTP — the frontend never needs the raw key.

**The lesson**: Moving secrets server-side (Nginx, a BFF, a backend) is the correct pattern.
The browser should never own credentials.
