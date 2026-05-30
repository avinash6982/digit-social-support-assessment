import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Apply from './pages/Apply'
import Success from './pages/Success'
import { useScrollToTop } from './hooks/useScrollToTop'
import { SunIcon, MoonIcon, GlobeIcon } from './components/Icons'
import { useTheme } from './hooks/useTheme'
import { useLanguage } from './hooks/useLanguage'

function AppContent() {
  useScrollToTop() // Resets scroll position to top of window on route change

  const { theme, toggleTheme } = useTheme()
  const { toggleLanguage, isRtl, t } = useLanguage()

  return (
    <>
      {/* Global Premium Navigation Appbar Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 dark:bg-slate-950/5 border-b border-slate-200/10 dark:border-white/5 px-6 py-3.5 flex items-center justify-between transition-all duration-300 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Brand/Logo Section */}
        <div className={`flex items-center gap-2.5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-extrabold text-xs sm:text-sm tracking-wider bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent uppercase select-none">
            {t('i18n_1')}
          </span>
        </div>

        {/* Global Controls Section */}
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all duration-300 cursor-pointer hover:bg-slate-200/20 dark:hover:bg-white/5 active:scale-95 text-xs font-bold flex items-center gap-1.5 focus:outline-none"
            aria-label="Toggle Language"
          >
            <GlobeIcon size={14} />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-slate-200/30 dark:bg-white/10 mx-1"></div>

          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all duration-300 cursor-pointer hover:bg-slate-200/20 dark:hover:bg-white/5 active:scale-90 focus:outline-none"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
        </div>
      </header>

      {/* Routed Pages Viewport */}
      <main className="pt-20 pb-8 px-4 flex items-center justify-center min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
