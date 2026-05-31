import { getAISuggestion } from '../../services/aiService'

describe('getAISuggestion — mock mode', () => {
  beforeAll(() => {
    process.env.VITE_USE_MOCK_AI = 'true'
  })

  afterAll(() => {
    process.env.VITE_USE_MOCK_AI = 'true' // restore default for other tests
  })

  it('returns a non-empty string for currentFinancialSituation', async () => {
    const result = await getAISuggestion('currentFinancialSituation', '')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns a non-empty string for employmentCircumstances', async () => {
    const result = await getAISuggestion('employmentCircumstances', '')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns a non-empty string for reasonForApplying', async () => {
    const result = await getAISuggestion('reasonForApplying', '')
    expect(result.length).toBeGreaterThan(0)
  })

  it('rejects with AbortError when signal is aborted before response', async () => {
    const controller = new AbortController()
    const promise = getAISuggestion('reasonForApplying', '', controller.signal)
    controller.abort()
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
  })
})

describe('getAISuggestion — real API mode', () => {
  beforeAll(() => {
    process.env.VITE_USE_MOCK_AI = 'false'
  })

  afterAll(() => {
    process.env.VITE_USE_MOCK_AI = 'true'
  })

  it('throws when the API returns a non-OK status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Unauthorized' } }),
    }) as jest.Mock

    await expect(getAISuggestion('reasonForApplying', 'some input')).rejects.toThrow('Unauthorized')
  })

  it('throws with fallback error message if JSON parsing fails on a non-OK response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error('parse error') },
    }) as jest.Mock

    await expect(getAISuggestion('reasonForApplying', 'some input')).rejects.toThrow('OpenAI error 500')
  })

  it('throws with fallback error message if body has no error details', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({}),
    }) as jest.Mock

    await expect(getAISuggestion('reasonForApplying', 'some input')).rejects.toThrow('OpenAI error 400')
  })

  it('throws when the response has no content', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '' } }] }),
    }) as jest.Mock

    await expect(getAISuggestion('reasonForApplying', '')).rejects.toThrow('Empty response from OpenAI')
  })

  it('returns trimmed content on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '  Success text  ' } }] }),
    }) as jest.Mock

    const result = await getAISuggestion('currentFinancialSituation', 'some input')
    expect(result).toBe('Success text')
  })
})
