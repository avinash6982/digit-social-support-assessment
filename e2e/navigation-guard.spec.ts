import { test, expect } from '@playwright/test'

test.describe('UAE Social Support - Navigation Guards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should active unsaved changes navigation guard modal', async ({ page }) => {
    await page.goto('/apply')

    // Fill Step 1 fields
    await page.locator('#name').fill('Interrupted User')
    await page.locator('#nationalId').fill('784-1990-1234567-1')
    await page.locator('#dob').fill('1990-01-01')
    await page.locator('#gender').selectOption('Male')
    await page.locator('#state').selectOption('Abu Dhabi')
    await page.locator('#city').fill('Abu Dhabi')
    await page.locator('#address').fill('123 Khalifa Street, Al Danah')
    await page.locator('#phone').fill('+971 50 123 4567')
    await page.locator('#email').fill('ahmed@example.ae')

    // Click Next Step to transition to Step 2 (setting context isDirty = true)
    await page.getByRole('button', { name: 'Next Step' }).click()

    // Click Go Back to return to Step 1
    await page.getByRole('button', { name: 'Go Back' }).click()

    // Try navigating to home by clicking Go Back again (which will call navigate('/'))
    await page.getByRole('button', { name: 'Go Back' }).click()

    // Modal warning should trigger
    const modal = page.locator('#unsaved-modal')
    await expect(modal).toBeVisible()

    // Click "Stay on page"
    await page.getByRole('button', { name: 'Stay on page' }).click()
    await expect(modal).not.toBeVisible()
    await expect(page).toHaveURL('/apply')

    // Click "Go Back" again to trigger the modal again
    await page.getByRole('button', { name: 'Go Back' }).click()
    await expect(modal).toBeVisible()

    // Click "Leave without saving"
    await page.getByRole('button', { name: 'Leave without saving' }).click()
    await expect(page).toHaveURL('/')
  })
})
