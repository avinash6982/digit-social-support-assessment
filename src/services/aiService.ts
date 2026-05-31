export type AIFieldName =
  | 'currentFinancialSituation'
  | 'employmentCircumstances'
  | 'reasonForApplying'

const SYSTEM_PROMPT = `You are a helpful assistant for a UAE government social support application.
Help the applicant articulate their situation clearly and formally.
Keep the tone respectful, factual, and concise. Write in first person. Maximum 120 words.
Do not add greetings, sign-offs, or meta-commentary — only the statement itself.`

const MOCK_RESPONSES: Record<AIFieldName, string> = {
  currentFinancialSituation:
    'I am currently facing significant financial hardship due to unexpected medical expenses and a reduction in my household income. My monthly expenses exceed my earnings, making it difficult to cover basic necessities such as rent, utilities, and food. I have no outstanding loans but have depleted my savings over the past several months. I am actively seeking additional income sources while managing my current obligations.',
  employmentCircumstances:
    'I was recently made redundant from my position as an administrative coordinator following a company restructuring. I have been unemployed for three months and am actively applying for new roles. Prior to this, I had been continuously employed for six years. I am registered with relevant employment agencies and attending skills development programmes to improve my prospects.',
  reasonForApplying:
    'I am applying for financial assistance to bridge the gap while I secure new employment. My immediate needs include covering rent arrears and essential utility bills to avoid eviction and service disconnection. I have two dependents and no other source of household income at this time. Any support received would allow me to stabilise my situation and continue my job search without further disruption.',
}

export async function getAISuggestion(
  fieldName: AIFieldName,
  userInput: string,
  signal?: AbortSignal
): Promise<string> {
  if (import.meta.env.VITE_USE_MOCK_AI === 'true') {
    // Mirror real fetch abort behaviour: reject with AbortError so callers handle it identically
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 1500)
      signal?.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')) })
    })
    return MOCK_RESPONSES[fieldName]
  }

  const userMessage = userInput.trim()
    ? `Help me write about the following for my UAE government financial assistance application — "${fieldName}" section. Here is what I have so far: ${userInput}`
    : `Write a statement for the "${fieldName}" section of a UAE government financial assistance application.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      max_tokens: 200,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `OpenAI error ${res.status}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from OpenAI')
  return content.trim()
}
