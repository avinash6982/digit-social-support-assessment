import { test, expect } from '@playwright/test'

test.describe('UAE Social Support — Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('toggles from light to dark mode', async ({ page }) => {
    // Ensure we start in light mode
    const html = page.locator('html')
    const initialDark = await html.evaluate((el) => el.classList.contains('dark'))

    const themeBtn = page.getByRole('button', { name: /Switch to (dark|light) mode/ })
    await themeBtn.click()

    const nowDark = await html.evaluate((el) => el.classList.contains('dark'))
    expect(nowDark).toBe(!initialDark)
  })

  test('toggles back to original mode on second click', async ({ page }) => {
    const html = page.locator('html')
    const initial = await html.evaluate((el) => el.classList.contains('dark'))

    const themeBtn = page.getByRole('button', { name: /Switch to (dark|light) mode/ })
    await themeBtn.click()
    await themeBtn.click()

    const restored = await html.evaluate((el) => el.classList.contains('dark'))
    expect(restored).toBe(initial)
  })

  test('theme choice persists across page reload', async ({ page }) => {
    const html = page.locator('html')
    const initial = await html.evaluate((el) => el.classList.contains('dark'))
    const expectedTheme = initial ? 'light' : 'dark'

    // Toggle once
    await page.getByRole('button', { name: /Switch to (dark|light) mode/ }).click()
    const toggled = await html.evaluate((el) => el.classList.contains('dark'))
    expect(toggled).toBe(!initial)

    // Wait for redux-persist to flush the new theme to localStorage before reloading
    await page.waitForFunction(
      (theme) => {
        try {
          const root = JSON.parse(localStorage.getItem('persist:root') || '{}')
          const settings = JSON.parse(root.settings || '{}')
          return settings.theme === theme
        } catch {
          return false
        }
      },
      expectedTheme
    )

    // Reload and check
    await page.reload()
    const afterReload = await html.evaluate((el) => el.classList.contains('dark'))
    expect(afterReload).toBe(!initial)
  })

  test('theme button aria-label updates after toggle', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: /Switch to (dark|light) mode/ })
    const labelBefore = await themeBtn.getAttribute('aria-label')
    await themeBtn.click()
    const labelAfter = await themeBtn.getAttribute('aria-label')
    expect(labelAfter).not.toBe(labelBefore)
  })
})
