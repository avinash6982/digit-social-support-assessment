import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Apply from './pages/Apply'
import Success from './pages/Success'
import { SunIcon, MoonIcon } from './components/Icons'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      {/* Floating Ghost Theme Switcher Button at top-right of the screen */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2.5 rounded-full text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all duration-300 cursor-pointer hover:bg-slate-200/20 dark:hover:bg-white/5 active:scale-90 focus:outline-none"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </button>

      {/* Routed Pages Viewport */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
