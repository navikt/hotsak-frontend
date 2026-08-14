import { expect, test } from '@playwright/test'

import { fyllPlaceholder, klikkFattVedtak, opprettVedtaksbrev, settBehandlingsresultat, åpneSak } from './helpers'

test.describe('Brevutkast', () => {
  test('kan opprette og ferdigstille et brevutkast', async ({ page }) => {
    test.slow()
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')

    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()
    await fyllPlaceholder(
      page,
      /Forklar hvilke opplysninger du har lagt vekt på når du har vurdert om vilkårene er oppfylt/i,
      'Vilkårene er vurdert som oppfylt basert på innsendt dokumentasjon.'
    )

    await expect(page.getByRole('button', { name: /^Rediger$/i })).toBeVisible()
    await expect(page.getByText(/Du har markert brevet som ferdigstilt/i)).toBeVisible()
  })

  test('kan slette et brevutkast', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')
    await opprettVedtaksbrev(page)
    await page.getByRole('button', { name: /Slett utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })

    await page.getByRole('button', { name: /Slett utkast/i }).click()
    const slettModal = page.getByRole('dialog', { name: /Vil du slette brevutkastet/i })
    await expect(slettModal).toBeVisible()
    await slettModal.getByRole('button', { name: /Slett utkast/i }).click()
    await expect(slettModal).not.toBeVisible({ timeout: 10_000 })

    await expect(page.getByRole('button', { name: /Opprett vedtaksbrev/i })).toBeVisible()
  })

  test('kan ikke fatte vedtak med et brevutkast som ikke er ferdigstilt', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')
    await opprettVedtaksbrev(page)
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })

    await klikkFattVedtak(page)

    const brevManglerModal = page.getByRole('dialog', { name: /Mangler brev/i })
    await expect(brevManglerModal).toBeVisible()

    await brevManglerModal.getByRole('button', { name: /lukk/i }).click()
    await expect(brevManglerModal).not.toBeVisible()
  })

  test('viser "Mangler resultat" hvis man forsøker å fatte vedtak uten å ha valgt resultat', async ({ page }) => {
    await åpneSak(page)

    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Mangler resultat/i })
    await expect(modal).toBeVisible()
    await expect(page.getByText(/Du må velge et vedtaksresultat/i)).toBeVisible()

    await modal.getByRole('button', { name: /lukk/i }).click()
    await expect(modal).not.toBeVisible()
  })
})
