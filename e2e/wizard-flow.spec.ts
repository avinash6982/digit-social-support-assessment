import { test, expect } from '@playwright/test'

test.describe('UAE Social Support - Main Form Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to form and complete the full wizard flow successfully', async ({ page }) => {
    // 1. Go to Apply Page
    await page.getByRole('button', { name: 'Go to Apply Page' }).click()
    await expect(page).toHaveURL('/apply')

    // Step 1: Personal Information
    await page.locator('#name').fill('Ahmed Al-Mansoori')
    await page.locator('#nationalId').fill('784-1990-1234567-1')
    await page.locator('#dob').fill('1990-01-01')
    await page.locator('#gender').selectOption('Male')
    await page.locator('#state').selectOption('Abu Dhabi')
    await page.locator('#city').fill('Abu Dhabi')
    await page.locator('#address').fill('123 Khalifa Street, Al Danah')
    await page.locator('#phone').fill('+971 50 123 4567')
    await page.locator('#email').fill('ahmed@example.ae')

    // Click Next Step
    await page.getByRole('button', { name: 'Next Step' }).click()

    // Step 2: Family & Financial Info
    await page.locator('#maritalStatus').selectOption('Married')
    // Married exposes the dependents field
    await page.locator('#dependents').fill('3')
    await page.locator('#employmentStatus').selectOption('Employed')
    await page.locator('#monthlyIncome').fill('12000')
    await page.locator('#housingStatus').selectOption('Rented')

    // Click Next Step
    await page.getByRole('button', { name: 'Next Step' }).click()

    // Step 3: Situation Descriptions
    await page.locator('#currentFinancialSituation').fill(
      'I am currently managing a household of five members, including three dependents. My monthly income of 12,000 AED is insufficient to cover the rising costs of living, rent in Abu Dhabi, and utility expenses.'
    )
    await page.locator('#employmentCircumstances').fill(
      'I have been continuously employed for three years, but my salary has been static despite increasing inflation and rising cost of living in the region.'
    )

    // Test AI Assist on the "Reason for Applying" field
    const helpMeWriteBtn = page.getByLabel('Help me write — Reason for Applying')
    await helpMeWriteBtn.click()

    // Dialog should open
    const modal = page.locator('#ai-assist-modal')
    await expect(modal).toBeVisible()

    // Wait for mock AI load and transition to suggestion (Accept button becomes visible)
    await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible({ timeout: 5000 })

    // Accept suggestion
    await page.getByRole('button', { name: 'Accept' }).click()

    // Modal should close
    await expect(modal).not.toBeVisible()

    // Text area should be filled with suggestion (in mock mode)
    const reasonValue = await page.locator('#reasonForApplying').inputValue()
    expect(reasonValue.length).toBeGreaterThan(50)

    // Submit Request
    await page.getByRole('button', { name: 'Submit Request' }).click()

    // Verify Success Screen
    await expect(page).toHaveURL('/success')
    await expect(page.getByText('Request Submitted Successfully!')).toBeVisible()

    // Click Back to Home
    await page.getByRole('button', { name: 'Return Home' }).click()
    await expect(page).toHaveURL('/')
  })
})
