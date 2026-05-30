import { useState, useEffect } from 'react'

function App() {
  const [isExplored, setIsExplored] = useState(false)
  const [systemTime, setSystemTime] = useState('')

  // Live premium clock indicator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setSystemTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="card-container">
      {/* Decorative Visual Badge */}
      <div className="visual-badge">
        <span className="pulse-dot" style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--tertiary)',
          borderRadius: '50%',
          display: 'inline-block',
          boxShadow: '0 0 10px var(--tertiary)',
          animation: 'pulse 1.8s infinite'
        }}></span>
        Support Portal v1.0.0
      </div>

      {/* Main Hello World Title */}
      <h1>Hello World</h1>
      
      {/* Beautiful Interactive Subtitle */}
      <p>
        Welcome to your brand-new, ultra-clean React &amp; Vite application. The unwanted boilerplate has been fully swept away, and the system is ready for development.
      </p>

      {/* Modern Interactive Action Button */}
      <button 
        className="action-button" 
        onClick={() => setIsExplored(!isExplored)}
        aria-label="Toggle Portal Exploration"
      >
        <span>{isExplored ? 'Portal Initialized' : 'Explore Support Portal'}</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ transform: isExplored ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s ease' }}
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </button>

      {/* Dynamic explored panel */}
      {isExplored && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(20, 184, 166, 0.05)',
          border: '1px dashed rgba(20, 184, 166, 0.3)',
          borderRadius: '16px',
          fontSize: '0.9rem',
          color: 'var(--tertiary)',
          animation: 'fadeIn 0.5s ease-out forwards',
          textAlign: 'center'
        }}>
          💡 All systems operational. Your codebase is primed for high-performance features.
        </div>
      )}

      {/* Sub-card details section showcasing structural metrics */}
      <div className="details-grid">
        <div className="detail-item">
          <span className="label">Status</span>
          <span className="value" style={{ color: 'var(--tertiary)' }}>Ready</span>
        </div>
        <div className="detail-item">
          <span className="label">Environment</span>
          <span className="value">Local</span>
        </div>
        <div className="detail-item">
          <span className="label">Active Time</span>
          <span className="value">{systemTime || '--:--:--'}</span>
        </div>
      </div>

      {/* Inline styles for keyframe animations (keeping CSS contained & modular) */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default App
