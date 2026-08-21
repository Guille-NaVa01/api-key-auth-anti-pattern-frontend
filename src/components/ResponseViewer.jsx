/**
 * ResponseViewer — terminal-style panel that displays the API response,
 * including animated entry and status-coded badge.
 */

const STATUS_COLOR = {
  ok:    'var(--green)',
  error: 'var(--red)',
  warn:  'var(--yellow)',
}

function statusColor(status, ok) {
  if (status === 'ERROR') return STATUS_COLOR.error
  if (ok) return STATUS_COLOR.ok
  return STATUS_COLOR.warn
}

function statusLabel(status) {
  if (status === 'ERROR') return '✖ ERROR'
  if (status >= 200 && status < 300) return `✔ ${status}`
  if (status === 401) return `⚠ ${status} Unauthorized`
  if (status === 403) return `⚠ ${status} Forbidden`
  if (status === 404) return `⚠ ${status} Not Found`
  return `• ${status}`
}

export default function ResponseViewer({ response, loading }) {
  const isEmpty = !response && !loading

  return (
    <div className="card response-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <p className="card-title" style={{ marginBottom: 0 }}>▸ Response</p>
        {response && (
          <span
            className="response-badge"
            style={{ color: statusColor(response.status, response.ok) }}
          >
            {statusLabel(response.status)}
          </span>
        )}
      </div>

      <div className="terminal">
        <div className="terminal-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
          <span className="terminal-title">response.json</span>
        </div>

        <pre className="terminal-body" id="output">
          {loading && (
            <span className="terminal-loading">
              <span className="cursor-blink">▮</span> Sending request…
            </span>
          )}
          {isEmpty && !loading && (
            <span className="terminal-placeholder">
              Click a button to send a request<span className="cursor-blink">_</span>
            </span>
          )}
          {response && !loading && (
            <span className="terminal-result" style={{ '--status-color': statusColor(response.status, response.ok) }}>
              <span className="terminal-comment"># {response.label}</span>
              {'\n'}
              {JSON.stringify(response.body, null, 2)}
            </span>
          )}
        </pre>
      </div>
    </div>
  )
}
