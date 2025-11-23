import { useNavigate, useLocation } from 'react-router-dom'

function PerformanceAnalysisAdmin() {
  const navigate = useNavigate()
  const score = 80 // placeholder value, replace with real data

  const goHome = () => navigate('/dashboard')
  const onDownload = () => {
    // Simple fallback: open print dialog (user can save as PDF)
    window.print()
  }
  const location = useLocation()
  // Try to read a gameId or userId passed via navigation state
  const gameId = location?.state?.gameId || location?.state?.userId || null

  return (
    <div style={{ padding: 24, minHeight: '100vh', boxSizing: 'border-box', background: '#f7f7f7' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', background: '#ffffff', padding: 48, border: '6px solid #f0f0f0', position: 'relative' }}>

        <button onClick={goHome} aria-label="Home" title="Home" style={{ position: 'absolute', left: 20, top: 20, border: 'none', background: 'transparent', cursor: 'pointer', padding: 6 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" fill="#333" />
            <path d="M9 21V13h6v8" fill="#333" opacity="0.0" />
          </svg>
        </button>

        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, color: '#333', margin: 0 }}>Performance Analysis Admin</h2>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 18, color: '#333', marginBottom: 12 }}>
              Your result is
              {gameId ? <span style={{ marginLeft: 10, fontSize: 16, color: '#666' }}>Game ID: {gameId}</span> : null}
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, color: '#111' }}>{score}%</div>
          </div>

          <p style={{ maxWidth: 760, margin: '36px auto', color: '#555', lineHeight: 1.6 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor, velit et gravida faucibus, diam magna rutrum lectus, luctus blandit enim leo eleifend leo. Phasellus urna justo, porta id semper eget, iaculis nec leo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum sceli et luctus</p>
        </div>

        <div style={{ position: 'absolute', right: 24, bottom: 24 }}>
          <button onClick={onDownload} style={{ padding: '12px 22px', border: '2px solid #d9d9d9', background: '#fff', cursor: 'pointer', fontSize: 16 }}>Download</button>
        </div>
      </div>
    </div>
  )
}

export default PerformanceAnalysisAdmin