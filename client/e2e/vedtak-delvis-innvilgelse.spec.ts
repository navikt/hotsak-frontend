import { expect, test } from '@playwright/test'

import { klikkFattVedtak, settBehandlingsresultat, åpneSak } from './helpers'

test.describe('Vedtak: Delvis innvilgelse', () => {
  test('krever brev ved delvis innvilgelse', async ({ page }) => {
    await åpneSak(page)

    // Set behandlingsresultat to Delvis innvilget
    await settBehandlingsresultat(page, 'Delvis innvilget')

    // Verify info message about mandatory brev
    await expect(page.getByText(/Du må sende vedtaksbrev ved delvis innvilgelse/i)).toBeVisible()

    // Click Fatt vedtak without brev -> should show BrevManglerModal
    await klikkFattVedtak(page)

    const brevManglerModal = page.getByRole('dialog', { name: /Mangler brev/i })
    await expect(brevManglerModal).toBeVisible()

    // Close the modal
    await brevManglerModal.getByRole('button', { name: /lukk/i }).click()
    await expect(brevManglerModal).not.toBeVisible()
  })

  test.skip('kan delvis innvilge en søknad etter å ha opprettet og ferdigstilt brev', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Delvis innvilget')

    // Create vedtaksbrev
    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()

    // Wait for brev panel to load and ferdigstill
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()

    // Now fatt vedtak should work
    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Vil du delvis innvilge søknaden/i })
    await expect(modal).toBeVisible()

    // Button should say "Delvis innvilg og send brev"
    await expect(modal.getByRole('button', { name: /Delvis innvilg og send brev/i })).toBeVisible()

    // Modal should show OeBS warning
    await expect(modal.getByText(/Du må legge til hjelpemidlene manuelt i OeBS/i)).toBeVisible()
  })
})
