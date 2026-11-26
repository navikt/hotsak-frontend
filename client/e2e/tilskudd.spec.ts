import { expect, test } from '@playwright/test'

import { settBehandlingsresultat, åpneSakSomMatcher } from './helpers'

test.describe('Tilskudd', () => {
  test('viser pengestøtte med kontonummer', async ({ page }) => {
    await åpneSakSomMatcher(page, /Tilskudd rimelige hjelpemidler/i)

    const pengestøtte = page.getByRole('region', { name: 'Pengestøtte' })
    await expect(pengestøtte.getByText(/Vi har kontonummeret til Berømt Aktivitet/)).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'Pengestøtte' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send til godkjenning' })).toBeVisible()
  })

  test('stopper sending til godkjenning når kontonummer mangler', async ({ page }) => {
    await åpneSakSomMatcher(page, 'Test: tilskudd uten kontonummer')

    await expect(page.getByText(/Vi fant ikke kontonummer til Vilde Verge/)).toBeVisible()

    await settBehandlingsresultat(page, 'Innvilget')
    await page.getByRole('button', { name: 'Send til godkjenning' }).click()

    await expect(page.getByRole('dialog', { name: 'Mangler kontonummer' })).toBeVisible()
  })

  test('viser feilmelding i kortet når kontonummer ikke kan hentes', async ({ page }) => {
    await åpneSakSomMatcher(page, 'Test: tilskudd med feil ved henting av kontonummer')

    await expect(page.getByText('Kunne ikke hente kontonummer')).toBeVisible()
    await expect(page.getByText('Viktor Verge', { exact: true })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /resultat/i })).toBeEnabled()
  })
})
