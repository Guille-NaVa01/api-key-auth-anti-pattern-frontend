/**
 * ApiTester — configuration card with the base URL input and action buttons.
 * No API key lives here; Nginx injects it server-side.
 */

export default function ApiTester({ baseUrl, setBaseUrl, onCall, loading }) {
  return (
    <div className="card">
      <p className="card-title">▸ Request Config</p>

      {/* Base URL */}
      <label className="field-label" htmlFor="baseUrl">Proxy URL</label>
      <input
        id="baseUrl"
        className="field-input"
        type="text"
        value={baseUrl}
        onChange={e => setBaseUrl(e.target.value)}
        spellCheck={false}
        autoComplete="off"
      />

      {/* Security note */}
      <p style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        marginTop: '10px',
        lineHeight: 1.6,
      }}>
        🔒 No <code style={{ color: 'var(--cyan)' }}>x-api-key</code> in this JS.<br/>
        Nginx adds it before forwarding.
      </p>

      {/* Action buttons */}
      <div className="btn-group">
        <button
          id="btnGetData"
          className="btn btn--get"
          onClick={() => onCall('/api/data', 'GET')}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : <span className="btn-method method--get">GET</span>}
          /api/data
        </button>

        <button
          id="btnPostData"
          className="btn btn--post"
          onClick={() => onCall('/api/data', 'POST')}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : <span className="btn-method method--post">POST</span>}
          /api/data
        </button>
      </div>
    </div>
  )
}
