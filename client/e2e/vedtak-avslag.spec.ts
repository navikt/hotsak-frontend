import { expect, test } from '@playwright/test'

import { klikkFattVedtak, settBehandlingsresultat, åpneSak } from './helpers'

test.describe('Vedtak: Avslag', () => {
  test('krever brev ved avslag', async ({ page }) => {
    await åpneSak(page)

    // Set behandlingsresultat to Avslått
    await settBehandlingsresultat(page, 'Avslått')

    // Verify info message about mandatory brev
    await expect(page.getByText(/Du må sende vedtaksbrev ved avslag/i)).toBeVisible()

    // Click Fatt vedtak without brev -> should show BrevManglerModal
    await klikkFattVedtak(page)

    const brevManglerModal = page.getByRole('dialog', { name: /Mangler brev/i })
    await expect(brevManglerModal).toBeVisible()
    await expect(brevManglerModal.getByText(/Opprett vedtaksbrev/i)).toBeVisible()

    // Close the modal
    await brevManglerModal.getByRole('button', { name: /lukk/i }).click()
    await expect(brevManglerModal).not.toBeVisible()
  })

  test.skip('kan avslå en søknad etter å ha opprettet og ferdigstilt brev', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Avslått')

    // Create vedtaksbrev
    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()

    // Wait for brev panel to load
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()

    // Now fatt vedtak should work
    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Vil du avslå søknaden/i })
    await expect(modal).toBeVisible()

    // Button should say "Avslå og send brev"
    await expect(modal.getByRole('button', { name: /Avslå og send brev/i })).toBeVisible()
  })
})
