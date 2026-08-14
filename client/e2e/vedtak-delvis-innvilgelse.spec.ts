import { expect, test } from '@playwright/test'

import { fyllPlaceholder, klikkFattVedtak, settBehandlingsresultat, åpneSak } from './helpers'

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

  test('kan delvis innvilge en søknad med brev', async ({ page }) => {
    test.slow()
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Delvis innvilget')

    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()
    await fyllPlaceholder(page, /^Legg inn innvilgede hjelpemidler$/i, 'Rullestol, manuell')
    await fyllPlaceholder(page, /^Legg inn avslåtte hjelpemidler$/i, 'Elektrisk rullestol')
    await fyllPlaceholder(page, /^innvilgede hjelpemidler$/i, 'rullestolen')
    await fyllPlaceholder(
      page,
      /^forklar hvilke opplysninger du har lagt vekt på når du har vurdert om vilkårene er oppfylt$/i,
      'Vilkårene for rullestolen er vurdert som oppfylt basert på innsendt dokumentasjon.'
    )
    await fyllPlaceholder(page, /^avslåtte hjelpemidler$/i, 'den elektriske rullestolen')
    await fyllPlaceholder(
      page,
      /^forklar hvilke opplysninger du har lagt vekt på når du har vurdert om vilkårene er oppfylt$/i,
      'Vilkårene for den elektriske rullestolen er vurdert som ikke oppfylt basert på innsendt dokumentasjon.'
    )
    await page.getByRole('button', { name: /^Rediger$/i }).waitFor({ state: 'visible', timeout: 10_000 })

    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Vil du delvis innvilge søknaden/i })
    await expect(modal).toBeVisible()

    const bekreftButton = modal.getByRole('button', { name: /Delvis innvilg og send brev/i })
    await expect(bekreftButton).toBeVisible()
    await expect(modal.getByText(/Du må legge til hjelpemidlene manuelt i OeBS/i)).toBeVisible()

    await bekreftButton.click()
    await expect(modal).not.toBeVisible({ timeout: 10_000 })

    await expect(page.getByText('Delvis innvilget').first()).toBeVisible()
    await expect(page.getByRole('combobox', { name: /resultat/i })).not.toBeVisible()
    await expect(page.getByText(/Brev lagt til utsending/i)).toBeVisible()
  })
})
