import { saveFormData, loadFormData, clearFormData, getSavedAt } from '../../utils/localStorage'
import CryptoJS from 'crypto-js'

const STORAGE_KEY = 'spf-form-data'

beforeEach(() => {
  localStorage.clear()
})

describe('saveFormData', () => {
  it('writes an encrypted item to localStorage', () => {
    saveFormData({ name: 'Ahmed', step: 1 })
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('stored value is not plaintext (it is encrypted)', () => {
    saveFormData({ name: 'Ahmed' })
    const raw = localStorage.getItem(STORAGE_KEY)!
    expect(raw).not.toContain('Ahmed')
  })
})

describe('loadFormData', () => {
  it('returns null when nothing is saved', () => {
    expect(loadFormData()).toBeNull()
  })

  it('round-trips the saved data correctly', () => {
    const payload = { name: 'Fatima', step: 2 }
    saveFormData(payload)
    const result = loadFormData()
    expect(result?.data).toEqual(payload)
  })

  it('includes a savedAt timestamp', () => {
    saveFormData({ name: 'Test' })
    const result = loadFormData()
    expect(result?.savedAt).toBeTruthy()
    expect(new Date(result!.savedAt).getTime()).not.toBeNaN()
  })

  it('returns null when ciphertext cannot be decrypted', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-ciphertext$$')
    const result = loadFormData()
    expect(result).toBeNull()
  })

  it('returns null when encrypted with a different key (wrong-key decryption gives empty plaintext)', () => {
    saveFormData({ name: 'Test' })
    const originalKey = process.env.VITE_STORAGE_ENCRYPTION_KEY
    process.env.VITE_STORAGE_ENCRYPTION_KEY = 'completely-different-key-32chars!'
    const result = loadFormData()
    process.env.VITE_STORAGE_ENCRYPTION_KEY = originalKey
    expect(result).toBeNull()
  })

  it('returns null and clears storage when decrypted text is invalid JSON', () => {
    const key = process.env.VITE_STORAGE_ENCRYPTION_KEY ?? 'fallback-dev-key'
    const encrypted = CryptoJS.AES.encrypt('plain text that is not valid json', key).toString()
    localStorage.setItem(STORAGE_KEY, encrypted)

    const result = loadFormData()
    expect(result).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('uses fallback encryption key when VITE_STORAGE_ENCRYPTION_KEY is undefined', () => {
    const originalKey = process.env.VITE_STORAGE_ENCRYPTION_KEY
    delete process.env.VITE_STORAGE_ENCRYPTION_KEY

    // This will encrypt using the fallback-dev-key
    saveFormData({ name: 'FallbackTest' })
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()

    // This should decrypt using the fallback-dev-key
    const result = loadFormData()
    expect(result?.data).toEqual({ name: 'FallbackTest' })

    process.env.VITE_STORAGE_ENCRYPTION_KEY = originalKey
  })
})

describe('clearFormData', () => {
  it('removes the storage key', () => {
    saveFormData({ name: 'Test' })
    clearFormData()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('is a no-op when nothing is saved', () => {
    expect(() => clearFormData()).not.toThrow()
  })
})

describe('getSavedAt', () => {
  it('returns null when nothing is saved', () => {
    expect(getSavedAt()).toBeNull()
  })

  it('returns a formatted time string after saving', () => {
    saveFormData({ name: 'Test' })
    const time = getSavedAt()
    expect(time).toMatch(/\d{1,2}:\d{2}/)
  })
})
