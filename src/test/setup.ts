import '@testing-library/jest-dom'

// Provide Vite env vars for Jest (import.meta.env → process.env via babel plugin)
process.env.VITE_STORAGE_ENCRYPTION_KEY = 'test-encryption-key-32chars-xd9'
process.env.VITE_USE_MOCK_AI = 'true'
process.env.VITE_OPENAI_API_KEY = ''
