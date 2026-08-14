import { expect, test } from '@playwright/test'

import { fyllPlaceholder, klikkFattVedtak, settBehandlingsresultat, åpneSak } from './helpers'

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

  test('kan avslå en søknad med brev', async ({ page }) => {
    test.slow()
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Avslått')

    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()
    await fyllPlaceholder(
      page,
      /forklar hvilke opplysninger du har lagt vekt på når du har vurdert at vilkårene ikke er oppfylt/i,
      'Vilkårene er vurdert som ikke oppfylt basert på innsendt dokumentasjon.'
    )
    await page.getByRole('button', { name: /^Rediger$/i }).waitFor({ state: 'visible', timeout: 10_000 })

    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Vil du avslå søknaden/i })
    await expect(modal).toBeVisible()

    const bekreftButton = modal.getByRole('button', { name: /Avslå og send brev/i })
    await expect(bekreftButton).toBeVisible()
    await bekreftButton.click()
    await expect(modal).not.toBeVisible({ timeout: 10_000 })

    await expect(page.getByText('Avslått').first()).toBeVisible()
    await expect(page.getByRole('combobox', { name: /resultat/i })).not.toBeVisible()
    await expect(page.getByText(/Brev lagt til utsending/i)).toBeVisible()
  })
})
