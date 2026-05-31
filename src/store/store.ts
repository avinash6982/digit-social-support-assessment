import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import settingsReducer from './settingsSlice'

// redux-persist requires an async storage interface even though localStorage is synchronous
const customStorage = {
  getItem: (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      return Promise.resolve(localStorage.getItem(key))
    }
    return Promise.resolve(null)
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
    return Promise.resolve()
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
    return Promise.resolve()
  }
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage: customStorage,
  whitelist: ['settings'] // Only persist the settings slice
}

const rootReducer = combineReducers({
  settings: settingsReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist standard non-serializable actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
