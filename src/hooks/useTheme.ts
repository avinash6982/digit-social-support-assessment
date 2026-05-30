import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { toggleTheme } from '../store/settingsSlice'

export function useTheme() {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.settings.theme)

  // Synchronize dynamic class additions to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const handleToggleTheme = () => {
    dispatch(toggleTheme())
  }

  return {
    theme,
    toggleTheme: handleToggleTheme,
    isDark: theme === 'dark'
  }
}

export default useTheme
