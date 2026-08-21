/**
 * Frontend logic for the Security Exercise demo.
 *
 * The API key is NO LONGER present here. It lives in the server-side .env
 * file and is injected by Nginx as an `x-api-key` header before each request
 * is forwarded to the backend. The browser never sees or sends the key —
 * it is invisible in DevTools, the page source, and network traffic.
 *
 * Architecture:
 *   Browser → Nginx (port 80) → inject x-api-key → Backend (port 8000)
 */

const baseUrlInput = document.getElementById("baseUrl");
const output = document.getElementById("output");

function show(label, status, body) {
  output.textContent = `${label}\nStatus: ${status}\n\n${JSON.stringify(body, null, 2)}`;
}

async function callEndpoint(path, { method = "GET" } = {}) {
  const baseUrl = baseUrlInput.value.replace(/\/$/, "");
  const headers = {};

  if (method === "POST") {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: method === "POST" ? JSON.stringify({ demo: true }) : undefined,
    });

    let body;
    try {
      body = await res.json();
    } catch {
      body = { raw: await res.text() };
    }

    show(`${method} ${path}`, res.status, body);
  } catch (err) {
    show(`${method} ${path}`, "ERROR", { error: String(err) });
  }
}

document.getElementById("btnGetData").addEventListener("click", () => {
  callEndpoint("/api/data", { method: "GET" });
});

document.getElementById("btnPostData").addEventListener("click", () => {
  callEndpoint("/api/data", { method: "POST" });
});
