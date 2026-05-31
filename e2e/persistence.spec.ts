import { test, expect } from '@playwright/test'

test.describe('UAE Social Support - Local Storage and Form Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should persist and recover encrypted form data on reload', async ({ page }) => {
    await page.goto('/apply')

    // Start filling Step 1
    await page.locator('#name').fill('Fatima Al-Suwaidi')
    await page.locator('#nationalId').fill('784-1985-7654321-2')

    // Click Save progress
    await page.getByRole('button', { name: 'Save' }).click()

    // Should show "Last saved at ..." status below
    const statusText = page.locator('role=status >> text=Last saved')
    await expect(statusText).toBeVisible()

    // Reload the page
    await page.reload()

    // Restore banner should be visible
    const restoreBanner = page.locator('role=status >> text=You have a saved application')
    await expect(restoreBanner).toBeVisible()

    // Click Restore
    await page.getByRole('button', { name: 'Restore' }).click()

    // Verify restored values
    await expect(page.locator('#name')).toHaveValue('Fatima Al-Suwaidi')
    await expect(page.locator('#nationalId')).toHaveValue('784-1985-7654321-2')

    // Clear saved data
    await page.getByRole('button', { name: 'Clear saved data' }).click()
    await page.getByRole('button', { name: 'Yes, clear' }).click()
    await expect(page.getByRole('button', { name: 'Clear saved data' })).not.toBeVisible()
  })
})
