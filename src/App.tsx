import { useState, useEffect } from 'react'
import Card from './components/Card'
import Button from './components/Button'
import Chip from './components/Chip'
import Text from './components/Text'

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
    <Card hoverable={true}>
      {/* Decorative Visual Badge */}
      <Chip dot={true} dotColor="teal" className="mb-6">
        Support Portal v1.0.0
      </Chip>

      {/* Main Hello World Title */}
      <Text variant="h1">
        Hello World
      </Text>
      
      {/* Beautiful Interactive Subtitle */}
      <Text variant="body">
        Welcome to your brand-new, ultra-clean React &amp; Vite application. The unwanted boilerplate has been fully swept away, and the system is ready for development.
      </Text>

      {/* Modern Interactive Action Button */}
      <Button 
        variant="primary" 
        onClick={() => setIsExplored(!isExplored)}
        aria-label="Toggle Portal Exploration"
        icon={
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform duration-300"
            style={{ transform: isExplored ? 'rotate(90deg)' : 'none' }}
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        }
      >
        {isExplored ? 'Portal Initialized' : 'Explore Support Portal'}
      </Button>

      {/* Dynamic explored panel */}
      {isExplored && (
        <div className="mt-6 p-4 bg-teal-500/5 border border-dashed border-teal-500/30 rounded-2xl text-sm text-teal-500 dark:text-teal-400 text-center animate-[fadeIn_0.5s_ease-out_forwards]">
          💡 All systems operational. Your codebase is primed for high-performance features.
        </div>
      )}

      {/* Sub-card details section showcasing structural metrics */}
      <div className="mt-9 pt-6 border-t border-slate-200/50 dark:border-white/10 flex justify-around gap-4">
        <div className="flex flex-col items-center gap-1">
          <Text variant="label">Status</Text>
          <Text variant="value" className="text-teal-500 dark:text-teal-400">Ready</Text>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Text variant="label">Environment</Text>
          <Text variant="value">Local</Text>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Text variant="label">Active Time</Text>
          <Text variant="value">{systemTime || '--:--:--'}</Text>
        </div>
      </div>
    </Card>
  )
}

export default App
