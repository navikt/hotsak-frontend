import { expect, test } from '@playwright/test'

import { klikkFattVedtak, settBehandlingsresultat, åpneSakSomMatcher } from './helpers'

const sakUtenBrukernummer = 'Test: bruker finnes ikke i OeBS'

test.describe('Bruker ikke funnet i OeBS', () => {
  test('viser varsel og stopper innvilgelse', async ({ page }) => {
    await åpneSakSomMatcher(page, sakUtenBrukernummer)

    await expect(page.getByRole('heading', { name: /Bruker ikke funnet i OeBS/i })).toBeVisible()

    await settBehandlingsresultat(page, 'Innvilget')
    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Bruker ikke funnet i OeBS/i })
    await expect(modal).toBeVisible()
  })

  test('stopper ikke avslag', async ({ page }) => {
    await åpneSakSomMatcher(page, sakUtenBrukernummer)

    await settBehandlingsresultat(page, 'Avslått')
    await klikkFattVedtak(page)

    await expect(page.getByRole('dialog', { name: /Mangler brev/i })).toBeVisible()
    await expect(page.getByRole('dialog', { name: /Bruker ikke funnet i OeBS/i })).not.toBeVisible()
  })
})
