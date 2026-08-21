import { useState } from 'react'
import ApiTester from './components/ApiTester.jsx'
import ResponseViewer from './components/ResponseViewer.jsx'
import './App.css'

export default function App() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [baseUrl, setBaseUrl]   = useState('http://localhost')

  async function callEndpoint(path, method = 'GET') {
    setLoading(true)
    setResponse(null)

    const headers = {}
    if (method === 'POST') headers['Content-Type'] = 'application/json'

    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
        method,
        headers,
        body: method === 'POST' ? JSON.stringify({ demo: true }) : undefined,
      })

      let body
      try { body = await res.json() }
      catch { body = { raw: await res.text() } }

      setResponse({ label: `${method} ${path}`, status: res.status, ok: res.ok, body })
    } catch (err) {
      setResponse({ label: `${method} ${path}`, status: 'ERROR', ok: false, body: { error: String(err) } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">⬡</span>
            <div>
              <h1 className="brand-title">SecureProxy</h1>
              <p className="brand-sub">API Key Auth Exercise</p>
            </div>
          </div>
          <div className="header-badge">
            <span className="badge badge--secure">🔒 Key Hidden</span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="app-main">
        {/* Architecture callout */}
        <div className="arch-banner">
          <code className="arch-flow">
            Browser <span className="arrow">──►</span>
            <span className="arch-node node--nginx">Nginx :80</span>
            <span className="arrow">──►</span>
            <span className="arch-node node--key">inject x-api-key</span>
            <span className="arrow">──►</span>
            <span className="arch-node node--backend">Backend :8000</span>
          </code>
          <p className="arch-note">The API key never touches your browser</p>
        </div>

        <div className="content-grid">
          <ApiTester
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
            onCall={callEndpoint}
            loading={loading}
          />
          <ResponseViewer response={response} loading={loading} />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <p>Cybersecurity Exercise · API Key Anti-Pattern Demo · Nginx Edition</p>
      </footer>
    </div>
  )
}
