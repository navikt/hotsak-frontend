import { expect, test } from '@playwright/test'

test.describe('Bestilling', () => {
  async function åpneBestilling(page: import('@playwright/test').Page) {
    await page.goto('/')
    await page.getByRole('link', { name: /Enhetens oppgaver/i }).click()
    await page.getByRole('table').waitFor({ state: 'visible' })

    // Find a row with "Bestilling" in the behandlingstype column
    const row = page
      .getByRole('row')
      .filter({ hasText: /Bestilling/ })
      .first()
    await row.getByRole('button', { name: /Ta oppgaven/i }).click()
    await page.getByRole('button', { name: /Åpne/i }).first().click()
  }

  test('kan godkjenne en bestilling', async ({ page }) => {
    await åpneBestilling(page)

    const godkjennButton = page.getByRole('button', { name: /godkjenn/i })
    await expect(godkjennButton).toBeVisible({ timeout: 10_000 })
    await godkjennButton.click()

    const modal = page.getByRole('dialog', { name: /Godkjenn bestillingen/i })
    await expect(modal).toBeVisible()
    await modal.getByRole('button', { name: /Godkjenn bestillingen/i }).click()
  })

  test('kan avvise en bestilling', async ({ page }) => {
    await åpneBestilling(page)

    const avvisButton = page.getByRole('button', { name: /avvis/i })
    await expect(avvisButton).toBeVisible({ timeout: 10_000 })
    await avvisButton.click()

    const modal = page.getByRole('dialog', { name: /vil du avvise bestillingen/i })
    await expect(modal).toBeVisible()
    await modal.getByRole('radio', { name: /Duplikat/i }).check()
    await modal.getByRole('button', { name: /avvis bestillingen/i }).click()
  })
})
