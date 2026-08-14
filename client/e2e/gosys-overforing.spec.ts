import { expect, test } from '@playwright/test'

import { åpneSak } from './helpers'

test.describe('Overføring til Gosys', () => {
  async function velgOverføringTilGosys(page: import('@playwright/test').Page) {
    await page.getByRole('combobox', { name: /resultat/i }).selectOption('HENLEGGELSE')
    await page.getByRole('radio', { name: /Søknaden er sendt inn på feil bruker/i }).check()
  }

  test('kan overføre en sak til Gosys', async ({ page }) => {
    await åpneSak(page)
    await velgOverføringTilGosys(page)

    await page.getByRole('button', { name: /Overfør til Gosys/i }).click()

    const modal = page.getByRole('dialog', { name: /Vil du overføre saken til Gosys/i })
    await expect(modal).toBeVisible()
    await modal.getByRole('button', { name: /Overfør til Gosys/i }).click()
    await expect(modal).not.toBeVisible()

    await expect(page.getByText('Overført til Gosys').first()).toBeVisible()
    await expect(page.getByRole('combobox', { name: /resultat/i })).not.toBeVisible()
  })

  test('kan ikke overføre sak til Gosys med brevutkast som ikke er slettet', async ({ page }) => {
    await åpneSak(page)

    await page.getByRole('combobox', { name: /resultat/i }).selectOption('HENLEGGELSE')
    await page.getByRole('radio', { name: /Begrunner ønsker å trekke søknaden/i }).check()
    await page.getByRole('textbox', { name: /Begrunn hvorfor saken lukkes/i }).fill('En begrunnelse')
    await page.getByRole('textbox', { name: /Begrunn hvorfor saken lukkes/i }).blur()
    await page.getByRole('button', { name: /Opprett brev/i }).click()

    await velgOverføringTilGosys(page)
    await page.getByRole('button', { name: /Overfør til Gosys/i }).click()

    const valideringsfeil = page.getByRole('dialog', { name: /Kan ikke overføre sak til Gosys/i })
    await expect(valideringsfeil).toBeVisible()
    await expect(valideringsfeil.getByText(/brevutkast/i)).toBeVisible()
  })
})
