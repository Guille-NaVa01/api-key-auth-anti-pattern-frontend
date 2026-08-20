/**
 * Frontend logic for the Security Exercise demo.
 *
 * NOTE: The API key here is read straight from a text input and sent as a
 * plain `x-api-key` header on every protected request. Anyone with access
 * to this browser tab (dev tools, an extension, a proxy) can read it.
 * That is the point of the exercise: a key that lives in client-side code
 * or is typed into a client-side form cannot be kept secret.
 */

const baseUrlInput = document.getElementById("baseUrl");
const apiKeyInput = document.getElementById("apiKey");
const output = document.getElementById("output");

function show(label, status, body) {
  output.textContent = `${label}\nStatus: ${status}\n\n${JSON.stringify(body, null, 2)}`;
}

async function callEndpoint(path, { method = "GET", withKey = false } = {}) {
  const baseUrl = baseUrlInput.value.replace(/\/$/, "");
  const headers = {};

  if (withKey) {
    headers["x-api-key"] = apiKeyInput.value;
  }
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
  callEndpoint("/api/data", { method: "GET", withKey: true });
});

document.getElementById("btnPostData").addEventListener("click", () => {
  callEndpoint("/api/data", { method: "POST", withKey: true });
});
