# UAE Social Support Portal

A UAE government financial assistance application portal built as a responsive, accessible, multi-step web form. Residents can apply for social support online, with progress saved locally and an AI writing assistant to help articulate their situation.

**Live demo:** https://digit-social-support-assessment.onrender.com

---

## Features

- **3-step application form** — Personal Information → Family & Financial Info → Situation Descriptions
- **Encrypted local persistence** — Progress is AES-encrypted and saved to localStorage; users can restore or discard on return
- **AI writing assistant** — OpenAI GPT-3.5-turbo integration with accept / edit / discard flow for the three free-text fields
- **Bilingual** — Full English and Arabic (RTL) support via i18next, persisted across sessions
- **Dark / light mode** — System preference detected on first load, toggleable, persisted
- **Accessible** — WCAG 2.1 AA: focus traps, `aria-modal`, `role="dialog"`, keyboard navigation, `aria-invalid` + `aria-describedby` on all form fields

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Forms | react-hook-form v7 |
| Routing | React Router v7 (data router) |
| State | Redux Toolkit + redux-persist |
| i18n | i18next + react-i18next |
| Encryption | CryptoJS (AES) |
| AI | OpenAI GPT-3.5-turbo |
| Unit Tests | Jest 30 + React Testing Library |
| E2E Tests | Playwright |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key (or use mock mode — see below)

### Installation

```bash
git clone https://github.com/avinash6982/digit-social-support-assessment
cd digit-social-support-assessment
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
# AES key for encrypting saved form data in localStorage
VITE_STORAGE_ENCRYPTION_KEY=your-random-32-char-key

# OpenAI API key for the AI writing assistant
VITE_OPENAI_API_KEY=sk-...

# Set to "true" to use mock AI responses (no API key required)
VITE_USE_MOCK_AI=false
```

> **Security note:** Never commit `.env`. The encryption key and API key are inlined at build time by Vite — they are visible in the browser bundle. This is acceptable for a demo; production use would require a server-side proxy.

### Development

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
```

Output is in `dist/`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## Project Structure

```
src/
├── components/          # Shared UI components (Button, FormField, FormSelect, ...)
├── context/             # WizardContext — multi-step form state + save/restore logic
├── hooks/               # useAIAssist, useLanguage, useTheme, useScrollToTop
├── i18n/                # i18next config + EN/AR locale JSON files
├── pages/               # Home, Apply (3-step form), Success
├── services/            # aiService.ts — OpenAI API integration
├── store/               # Redux store + settingsSlice (theme, language)
├── test/                # Jest setup, testUtils (render wrapper)
├── utils/               # localStorage.ts — AES encrypt/decrypt helpers
└── __tests__/           # Unit tests mirroring src structure
```

---

## Testing

### Unit Tests (Jest + React Testing Library)

The unit test suite covers 100% of statements, branches, functions, and lines across all non-page source files.

```bash
npm test                  # run all tests
npm run test:watch        # run tests in watch mode
npm run test:coverage     # generate coverage report in coverage/
```

Key areas covered:
- `localStorage.ts` — save / load / clear / corruption handling
- `settingsSlice.ts` — all reducers + system theme detection
- `aiService.ts` — mock mode, real API success/error paths, abort signal
- `useAIAssist.ts` — full state machine (closed → loading → suggestion → editing)
- `WizardContext.tsx` — navigation, dirty tracking, save/restore, hydration
- All components — render, ARIA attributes, keyboard interactions, RTL mode

### End-to-End Tests (Playwright)

31 e2e tests covering the full user journey across 7 spec files.

```bash
npx playwright test               # run all e2e tests (headless)
npx playwright test --ui          # run with Playwright UI
npx playwright test e2e/home.spec.ts  # run a single spec
```

Spec files and coverage:
| File | Coverage |
|------|----------|
| `home.spec.ts` | Home page — title, eligibility toggle, live clock, metrics, navigation |
| `form-validation.spec.ts` | Step 1/2/3 validation — required fields, Emirates ID format, age, email, negative numbers, minLength |
| `ai-assist.spec.ts` | AI writing assistant — accept, edit, discard, Escape, sequential abort |
| `theme.spec.ts` | Theme toggle — light↔dark, persistence across reload, aria-label updates |
| `navigation-guard.spec.ts` | Unsaved-changes modal — stay, leave, save-and-leave, Escape |
| `persistence.spec.ts` | Form save/restore/clear — encrypted localStorage round-trip |
| `wizard-flow.spec.ts` | Full 3-step submission flow — happy path through to /success |

---

## Deployment (Render)

The app is deployed as a **Static Site** on Render.

**Build command:** `npm install; npm run build`  
**Publish directory:** `dist`

Since this is a client-side SPA, add a **Rewrite rule** in the Render dashboard under **Settings → Redirects/Rewrites**:

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

This ensures direct URL access to `/apply` and `/success` serves `index.html` and lets React Router handle routing client-side.

---

## AI Writing Assistant

The AI assistant helps applicants write the three free-text fields in Step 3:

- **Current Financial Situation**
- **Employment Circumstances**
- **Reason for Applying**

Clicking **Help me write** opens a modal that calls GPT-3.5-turbo with the applicant's existing input as context. The result can be accepted as-is, edited in the modal before accepting, or discarded.

To develop without spending API credits, set `VITE_USE_MOCK_AI=true` in `.env`. This returns realistic mock responses after a 1.5 s simulated delay.

---

## Form Persistence

When a user starts filling the form and navigates away, a modal prompts them to:

- **Stay** — remain on the form
- **Save and leave** — encrypt and save progress to localStorage, then navigate
- **Leave without saving** — discard and navigate

On returning to `/apply`, if saved data exists the user is offered to restore it. Data is AES-encrypted using `VITE_STORAGE_ENCRYPTION_KEY` before being written to localStorage.
