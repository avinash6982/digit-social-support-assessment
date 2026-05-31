import { test, expect } from '@playwright/test'

async function fillAndAdvanceStep1(page: import('@playwright/test').Page) {
  await page.goto('/apply')
  await page.locator('#name').fill('Interrupted User')
  await page.locator('#nationalId').fill('784-1990-1234567-1')
  await page.locator('#dob').fill('1990-01-01')
  await page.locator('#gender').selectOption('Male')
  await page.locator('#state').selectOption('Abu Dhabi')
  await page.locator('#city').fill('Abu Dhabi')
  await page.locator('#address').fill('123 Khalifa Street, Al Danah')
  await page.locator('#phone').fill('+971501234567')
  await page.locator('#email').fill('ahmed@example.ae')
  await page.getByRole('button', { name: 'Next Step' }).click()
  await expect(page.getByText('STEP 2 OF 3')).toBeVisible()
  // Go back to step 1 so "Go Back" from here triggers navigation to /
  await page.getByRole('button', { name: 'Go back to previous step' }).click()
}

test.describe('UAE Social Support - Navigation Guards', () => {
  test('Stay on page: modal closes and user remains on /apply', async ({ page }) => {
    await fillAndAdvanceStep1(page)
    await page.getByRole('button', { name: 'Go back to home' }).click()

    const modal = page.locator('#unsaved-modal')
    await expect(modal).toBeVisible()

    await page.getByRole('button', { name: 'Stay on page' }).click()
    await expect(modal).not.toBeVisible()
    await expect(page).toHaveURL('/apply')
  })

  test('Leave without saving: navigates away and discards data', async ({ page }) => {
    await fillAndAdvanceStep1(page)
    await page.getByRole('button', { name: 'Go back to home' }).click()

    const modal = page.locator('#unsaved-modal')
    await expect(modal).toBeVisible()

    await page.getByText('Leave without saving').click()
    await expect(page).toHaveURL('/')

    // Returning to /apply should not show a restore banner
    await page.goto('/apply')
    await expect(page.getByText('You have a saved application')).not.toBeVisible()
  })

  test('Save and Leave: saves progress, navigates away, restore banner shown on return', async ({ page }) => {
    await fillAndAdvanceStep1(page)
    await page.getByRole('button', { name: 'Go back to home' }).click()

    const modal = page.locator('#unsaved-modal')
    await expect(modal).toBeVisible()

    await page.getByRole('button', { name: 'Save and leave' }).click()
    await expect(page).toHaveURL('/')

    // Returning to /apply should show restore banner with saved data
    await page.goto('/apply')
    await expect(page.getByText('You have a saved application')).toBeVisible()
    await page.getByRole('button', { name: 'Restore' }).click()
    await expect(page.locator('#name')).toHaveValue('Interrupted User')
  })

  test('Escape key: modal closes and user stays on /apply', async ({ page }) => {
    await fillAndAdvanceStep1(page)
    await page.getByRole('button', { name: 'Go back to home' }).click()

    const modal = page.locator('#unsaved-modal')
    await expect(modal).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
    await expect(page).toHaveURL('/apply')
  })
})
