import { test, expect } from '@playwright/test'

test.describe('UAE Social Support — Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the portal title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('UAE Social Support Portal')
    await expect(page.getByText('5–7 working days')).toBeVisible()
  })

  test('eligibility criteria panel toggles open and closed', async ({ page }) => {
    // Panel is hidden initially
    await expect(page.getByText('Ministry of Social Affairs')).not.toBeVisible()

    // Open
    await page.getByRole('button', { name: 'Eligibility Criteria' }).click()
    await expect(page.getByText('Ministry of Social Affairs')).toBeVisible()

    // Button label changes to Hide Criteria after open
    await expect(page.getByRole('button', { name: 'Hide Criteria' })).toBeVisible()

    // Close
    await page.getByRole('button', { name: 'Hide Criteria' }).click()
    await expect(page.getByText('Ministry of Social Affairs')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Eligibility Criteria' })).toBeVisible()
  })

  test('Apply for Assistance button navigates to /apply', async ({ page }) => {
    await page.getByRole('button', { name: 'Go to Apply Page' }).click()
    await expect(page).toHaveURL('/apply')
  })

  test('displays live clock that updates', async ({ page }) => {
    const clock = page.getByText(/^\d{1,2}:\d{2}:\d{2}/)
    await expect(clock).toBeVisible()

    const first = await clock.textContent()
    await page.waitForTimeout(1100)
    const second = await clock.textContent()
    expect(first).not.toBe(second)
  })

  test('metric chips show correct labels and values', async ({ page }) => {
    await expect(page.getByText('Response Time')).toBeVisible()
    await expect(page.getByText('5–7 Days')).toBeVisible()
    await expect(page.getByText('Eligibility', { exact: true })).toBeVisible()
    await expect(page.getByText('UAE Residents')).toBeVisible()
    await expect(page.getByText('Current Time')).toBeVisible()
  })
})
