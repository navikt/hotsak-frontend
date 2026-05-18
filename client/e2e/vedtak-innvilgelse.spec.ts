import { expect, test } from '@playwright/test'

import { klikkFattVedtak, settBehandlingsresultat, åpneSak } from './helpers'

test.describe('Vedtak: Innvilgelse', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('nyttSaksbilde', 'true')
    })
  })

  test('kan innvilge en søknad', async ({ page }) => {
    await åpneSak(page)

    // Set behandlingsresultat to Innvilget
    await settBehandlingsresultat(page, 'Innvilget')

    // Verify info message about optional brev
    await expect(page.getByText(/Du må selv vurdere om det er behov/i)).toBeVisible()

    // Click Fatt vedtak
    await klikkFattVedtak(page)

    // Verify FattVedtakModal opens
    const modal = page.getByRole('dialog', { name: /Vil du innvilge søknaden/i })
    await expect(modal).toBeVisible()

    // Verify button text does NOT contain "send brev" (no brev created)
    await expect(modal.getByRole('button', { name: /^Innvilg$/i })).toBeVisible()
  })

  test.skip('kan innvilge en søknad med brev', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')

    // Create a brev (optional for innvilgelse)
    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()

    // Wait for brev panel to load and ferdigstill
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()

    // Now fatt vedtak
    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Vil du innvilge søknaden/i })
    await expect(modal).toBeVisible()

    // Button should say "Innvilg og send brev" since brev exists
    await expect(modal.getByRole('button', { name: /Innvilg og send brev/i })).toBeVisible()
  })
})
