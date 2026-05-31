import { test, expect } from '@playwright/test'

async function fillStep1(page: import('@playwright/test').Page) {
  await page.locator('#name').fill('Ahmed Al-Mansoori')
  await page.locator('#nationalId').fill('784-1990-1234567-1')
  await page.locator('#dob').fill('1990-01-01')
  await page.locator('#gender').selectOption('Male')
  await page.locator('#state').selectOption('Abu Dhabi')
  await page.locator('#city').fill('Abu Dhabi')
  await page.locator('#address').fill('123 Khalifa Street, Al Danah')
  await page.locator('#phone').fill('+971501234567')
  await page.locator('#email').fill('ahmed@example.ae')
}

async function fillStep2(page: import('@playwright/test').Page) {
  await page.locator('#maritalStatus').selectOption('Married')
  await page.locator('#dependents').fill('2')
  await page.locator('#employmentStatus').selectOption('Unemployed')
  await page.locator('#monthlyIncome').fill('0')
  await page.locator('#housingStatus').selectOption('Rented')
}

test.describe('UAE Social Support — Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apply')
  })

  test('Step 1: Next Step blocked and errors shown when all fields are empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Next Step' }).click()

    await expect(page.getByText('STEP 1 OF 3')).toBeVisible()
    await expect(page.locator('#name-error')).toBeVisible()
    await expect(page.locator('#nationalId-error')).toBeVisible()
    await expect(page.locator('#dob-error')).toBeVisible()
  })

  test('Step 1: invalid Emirates ID format shows specific error', async ({ page }) => {
    await page.locator('#nationalId').fill('123-bad-format')
    await page.locator('#nationalId').blur()
    await expect(page.locator('#nationalId-error')).toBeVisible()
    const errorText = await page.locator('#nationalId-error').textContent()
    expect(errorText).toContain('784')
  })

  test('Step 1: applicant under 18 shows age error', async ({ page }) => {
    const under18 = new Date()
    under18.setFullYear(under18.getFullYear() - 17)
    await page.locator('#dob').fill(under18.toISOString().split('T')[0])
    await page.locator('#dob').blur()
    await expect(page.locator('#dob-error')).toBeVisible()
    const errorText = await page.locator('#dob-error').textContent()
    expect(errorText).toContain('18')
  })

  test('Step 1: future date of birth shows error', async ({ page }) => {
    await page.locator('#dob').fill('2099-01-01')
    await page.locator('#dob').blur()
    await expect(page.locator('#dob-error')).toBeVisible()
  })

  test('Step 1: invalid email format shows error', async ({ page }) => {
    await page.locator('#email').fill('not-an-email')
    await page.locator('#email').blur()
    await expect(page.locator('#email-error')).toBeVisible()
  })

  test('Step 1: valid data allows advancing to Step 2', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: 'Next Step' }).click()
    await expect(page.getByText('STEP 2 OF 3')).toBeVisible()
  })

  test('Step 2: Next Step blocked when required fields are empty', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: 'Next Step' }).click()
    await expect(page.getByText('STEP 2 OF 3')).toBeVisible()

    await page.getByRole('button', { name: 'Next Step' }).click()
    await expect(page.getByText('STEP 2 OF 3')).toBeVisible()
    await expect(page.locator('#maritalStatus-error')).toBeVisible()
  })

  test('Step 2: dependents field rejects negative numbers', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: 'Next Step' }).click()

    await page.locator('#maritalStatus').selectOption('Married')
    await page.locator('#dependents').fill('-1')
    await page.locator('#dependents').blur()
    await expect(page.locator('#dependents-error')).toBeVisible()
  })

  test('Step 3: Submit blocked when text areas have fewer than 50 characters', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: 'Next Step' }).click()
    await fillStep2(page)
    await page.getByRole('button', { name: 'Next Step' }).click()
    await expect(page.getByText('STEP 3 OF 3')).toBeVisible()

    await page.locator('#currentFinancialSituation').fill('Too short')
    await page.getByRole('button', { name: 'Submit Request' }).click()

    await expect(page.getByText('STEP 3 OF 3')).toBeVisible()
    await expect(page.locator('#currentFinancialSituation-error')).toBeVisible()
  })

  test('Step 1: going back from Step 2 preserves filled data', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: 'Next Step' }).click()
    await expect(page.getByText('STEP 2 OF 3')).toBeVisible()

    await page.getByRole('button', { name: 'Go back to previous step' }).click()
    await expect(page.getByText('STEP 1 OF 3')).toBeVisible()

    await expect(page.locator('#name')).toHaveValue('Ahmed Al-Mansoori')
    await expect(page.locator('#email')).toHaveValue('ahmed@example.ae')
  })
})
