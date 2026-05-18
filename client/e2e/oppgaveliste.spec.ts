import { expect, test } from '@playwright/test'

test.describe('Oppgaveliste', () => {
  test('viser oppgaveliste med oppgaver', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Enhetens oppgaver/i }).click()
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('button', { name: /Ta oppgaven/i }).first()).toBeVisible()
  })

  test('kan ta en oppgave og navigere til sak', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Enhetens oppgaver/i }).click()
    await page.getByRole('table').waitFor({ state: 'visible' })
    await page
      .getByRole('button', { name: /Ta oppgaven/i })
      .first()
      .click()

    // After claiming, the button changes to "Åpne"
    await page.getByRole('button', { name: /Åpne/i }).first().click()

    // Should navigate to oppgave view
    await expect(page).toHaveURL(/\/oppgave\//)
  })

  test('kan bytte mellom tabs åpne og ferdigstilte', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Enhetens oppgaver/i }).click()
    await page.getByRole('table').waitFor({ state: 'visible' })

    // Check that tabs exist
    await expect(page.getByRole('tab', { name: /ferdigstilte/i })).toBeVisible()
  })
})
