import settingsReducer, {
  setTheme,
  setLanguage,
  toggleTheme,
  toggleLanguage,
} from '../../store/settingsSlice'

describe('settingsSlice', () => {
  const lightState = { theme: 'light' as const, language: 'en' as const }
  const darkState = { theme: 'dark' as const, language: 'en' as const }

  describe('toggleTheme', () => {
    it('switches light → dark', () => {
      const next = settingsReducer(lightState, toggleTheme())
      expect(next.theme).toBe('dark')
    })

    it('switches dark → light', () => {
      const next = settingsReducer(darkState, toggleTheme())
      expect(next.theme).toBe('light')
    })
  })

  describe('setTheme', () => {
    it('sets theme to dark', () => {
      const next = settingsReducer(lightState, setTheme('dark'))
      expect(next.theme).toBe('dark')
    })

    it('sets theme to light', () => {
      const next = settingsReducer(darkState, setTheme('light'))
      expect(next.theme).toBe('light')
    })
  })

  describe('toggleLanguage', () => {
    it('switches en → ar', () => {
      const next = settingsReducer(lightState, toggleLanguage())
      expect(next.language).toBe('ar')
    })

    it('switches ar → en', () => {
      const arState = { theme: 'light' as const, language: 'ar' as const }
      const next = settingsReducer(arState, toggleLanguage())
      expect(next.language).toBe('en')
    })
  })

  describe('setLanguage', () => {
    it('sets language to ar', () => {
      const next = settingsReducer(lightState, setLanguage('ar'))
      expect(next.language).toBe('ar')
    })

    it('sets language to en', () => {
      const arState = { theme: 'light' as const, language: 'ar' as const }
      const next = settingsReducer(arState, setLanguage('en'))
      expect(next.language).toBe('en')
    })
  })

  describe('getInitialTheme system detection', () => {
    const originalMatchMedia = window.matchMedia

    afterEach(() => {
      if (originalMatchMedia) {
        window.matchMedia = originalMatchMedia
      } else {
        // @ts-ignore
        delete window.matchMedia
      }
    })

    it('defaults to dark theme when prefers-color-scheme is dark', () => {
      window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
      })) as any

      let isolatedReducer: any
      jest.isolateModules(() => {
        isolatedReducer = require('../../store/settingsSlice').default
      })

      const initialState = isolatedReducer(undefined, { type: '@@INIT' })
      expect(initialState.theme).toBe('dark')
    })

    it('defaults to light theme when prefers-color-scheme is light (matches false)', () => {
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
      })) as any

      let isolatedReducer: any
      jest.isolateModules(() => {
        isolatedReducer = require('../../store/settingsSlice').default
      })

      const initialState = isolatedReducer(undefined, { type: '@@INIT' })
      expect(initialState.theme).toBe('light')
    })

    it('defaults to light theme when window.matchMedia is undefined', () => {
      // @ts-ignore
      delete window.matchMedia

      let isolatedReducer: any
      jest.isolateModules(() => {
        isolatedReducer = require('../../store/settingsSlice').default
      })

      const initialState = isolatedReducer(undefined, { type: '@@INIT' })
      expect(initialState.theme).toBe('light')
    })
  })
})
