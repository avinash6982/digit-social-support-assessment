import { test, expect } from '@playwright/test'

async function navigateToStep3(page: import('@playwright/test').Page) {
  await page.goto('/apply')

  // Step 1
  await page.locator('#name').fill('Ahmed Al-Mansoori')
  await page.locator('#nationalId').fill('784-1990-1234567-1')
  await page.locator('#dob').fill('1990-01-01')
  await page.locator('#gender').selectOption('Male')
  await page.locator('#state').selectOption('Abu Dhabi')
  await page.locator('#city').fill('Abu Dhabi')
  await page.locator('#address').fill('123 Khalifa Street')
  await page.locator('#phone').fill('+971501234567')
  await page.locator('#email').fill('ahmed@example.ae')
  await page.getByRole('button', { name: 'Next Step' }).click()

  // Step 2
  await page.locator('#maritalStatus').selectOption('Married')
  await page.locator('#dependents').fill('2')
  await page.locator('#employmentStatus').selectOption('Unemployed')
  await page.locator('#monthlyIncome').fill('0')
  await page.locator('#housingStatus').selectOption('Rented')
  await page.getByRole('button', { name: 'Next Step' }).click()

  await expect(page.getByText('STEP 3 OF 3')).toBeVisible()
}

test.describe('UAE Social Support — AI Writing Assistant', () => {
  test('Accept flow: suggestion is inserted into the textarea', async ({ page }) => {
    await navigateToStep3(page)

    await page.getByLabel('Help me write — Current Financial Situation').click()
    const modal = page.locator('#ai-assist-modal')
    await expect(modal).toBeVisible()

    await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Accept' }).click()

    await expect(modal).not.toBeVisible()
    const value = await page.locator('#currentFinancialSituation').inputValue()
    expect(value.length).toBeGreaterThan(50)
  })

  test('Edit flow: user can modify suggestion before accepting', async ({ page }) => {
    await navigateToStep3(page)

    await page.getByLabel('Help me write — Employment Circumstances').click()
    const modal = page.locator('#ai-assist-modal')

    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Edit' }).click()

    const editArea = modal.getByRole('textbox')
    await expect(editArea).toBeVisible()

    await editArea.fill('My custom employment description that is longer than fifty characters total.')
    await page.getByRole('button', { name: 'Accept' }).click()

    await expect(modal).not.toBeVisible()
    const value = await page.locator('#employmentCircumstances').inputValue()
    expect(value).toContain('My custom employment description')
  })

  test('Discard flow: modal closes without changing the textarea', async ({ page }) => {
    await navigateToStep3(page)

    await page.locator('#reasonForApplying').fill('My original reason for applying, saved before opening the assistant.')
    await page.locator('#reasonForApplying').blur()

    await page.getByLabel('Help me write — Reason for Applying').click()
    const modal = page.locator('#ai-assist-modal')
    await expect(modal).toBeVisible()

    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: 'Discard' }).click()

    await expect(modal).not.toBeVisible()
    await expect(page.locator('#reasonForApplying')).toHaveValue('My original reason for applying, saved before opening the assistant.')
  })

  test('Escape key discards the modal', async ({ page }) => {
    await navigateToStep3(page)

    await page.getByLabel('Help me write — Current Financial Situation').click()
    const modal = page.locator('#ai-assist-modal')
    await expect(modal).toBeVisible()

    await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible({ timeout: 5000 })
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  })

  test('Opening a second AI modal aborts the first request', async ({ page }) => {
    await navigateToStep3(page)

    await page.getByLabel('Help me write — Current Financial Situation').click()
    const modal = page.locator('#ai-assist-modal')
    await expect(modal).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    await page.getByLabel('Help me write — Reason for Applying').click()
    await expect(modal).toBeVisible()
    await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible({ timeout: 5000 })
  })
})
