import { test, expect } from '@playwright/test'

test.describe('UAE Social Support - Localization and RTL/LTR Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should handle LTR/RTL translation layout swaps', async ({ page }) => {
    // Switch language to Arabic via global layout header/toggle
    const arToggle = page.getByRole('button', { name: 'Switch to Arabic' })
    await arToggle.click()

    // Asserts page dir swaps to RTL
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')

    // Verify title text switches to Arabic
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('بوابة الدعم الاجتماعي الإماراتية')

    // Switch back to English
    const enToggle = page.getByRole('button', { name: 'Switch to English' })
    await enToggle.click()
    await expect(html).toHaveAttribute('dir', 'ltr')
  })
})
