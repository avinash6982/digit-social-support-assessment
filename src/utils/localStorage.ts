import CryptoJS from 'crypto-js'

const STORAGE_KEY = 'spf-form-data'

// Fallback is intentionally weak — VITE_STORAGE_ENCRYPTION_KEY must be set in production
const getKey = (): string =>
  import.meta.env.VITE_STORAGE_ENCRYPTION_KEY ?? 'fallback-dev-key'

export const saveFormData = (data: unknown): void => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify({ data, savedAt: new Date().toISOString() }),
      getKey()
    ).toString()
    localStorage.setItem(STORAGE_KEY, encrypted)
  } catch {
    // fail silently
  }
}

export const loadFormData = (): { data: unknown; savedAt: string } | null => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY)
    if (!encrypted) return null
    const bytes = CryptoJS.AES.decrypt(encrypted, getKey())
    const plaintext = bytes.toString(CryptoJS.enc.Utf8)
    if (!plaintext) return null
    return JSON.parse(plaintext)
  } catch {
    // Corrupted ciphertext can never be recovered; wipe it so the restore banner disappears
    clearFormData()
    return null
  }
}

export const clearFormData = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getSavedAt = (): string | null => {
  const saved = loadFormData()
  if (!saved?.savedAt) return null
  return new Date(saved.savedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}
