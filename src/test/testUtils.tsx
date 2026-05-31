import { type ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import settingsReducer from '../store/settingsSlice'

export function createTestStore(preloadedState?: { settings?: { theme: 'light' | 'dark'; language: 'en' | 'ar' } }) {
  return configureStore({
    reducer: { settings: settingsReducer },
    preloadedState,
  })
}

function AllProviders({ children }: { children: ReactNode }) {
  const store = createTestStore()
  return <Provider store={store}>{children}</Provider>
}

function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export { renderWithProviders as render }
export * from '@testing-library/react'
