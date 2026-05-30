import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  theme: 'light' | 'dark'
  language: 'en' | 'ar'
}

// Initial defaults checked safely before persistor hydration
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

const initialState: SettingsState = {
  theme: getInitialTheme(),
  language: 'en'
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'ar' : 'en'
    }
  }
})

export const { setTheme, setLanguage, toggleTheme, toggleLanguage } = settingsSlice.actions
export default settingsSlice.reducer
