import { expect, test } from '@playwright/test'

import { fyllPlaceholder, åpneSak } from './helpers'

test.describe('Henleggelse', () => {
  test('kan henlegge en sak', async ({ page }) => {
    await åpneSak(page)

    await page.getByRole('combobox', { name: /resultat/i }).selectOption('HENLEGGELSE')

    await page.getByRole('radio', { name: /Annet/i }).check()
    await page.getByRole('textbox', { name: /Begrunn hvorfor saken lukkes/i }).fill('En begrunnelse for henleggelsen')
    await page.getByRole('textbox', { name: /Begrunn hvorfor saken lukkes/i }).blur()

    await page.getByRole('button', { name: /Lukk saken/i }).click()

    const modal = page.getByRole('dialog', { name: /Vil du lukke.*saken/i })
    await expect(modal).toBeVisible()
    await modal.getByRole('button', { name: /Journalfør notat og lukk saken/i }).click()
    await expect(modal).not.toBeVisible()

    await expect(page.getByText('Henlagt').first()).toBeVisible()
    await expect(page.getByRole('combobox', { name: /resultat/i })).not.toBeVisible()
  })

  test('krever brev ved enkelte henleggelsesårsaker', async ({ page }) => {
    await åpneSak(page)

    await page.getByRole('combobox', { name: /resultat/i }).selectOption('HENLEGGELSE')
    await page.getByRole('radio', { name: /Bruker ønsker å trekke søknaden/i }).check()

    await page.getByRole('button', { name: /Lukk saken/i }).click()

    const brevManglerModal = page.getByRole('dialog', { name: /Mangler brev/i })
    await expect(brevManglerModal).toBeVisible()

    await brevManglerModal.getByRole('button', { name: /lukk/i }).click()
    await expect(brevManglerModal).not.toBeVisible()
  })

  test('kan henlegge en sak med brev', async ({ page }) => {
    test.slow()
    await åpneSak(page)

    await page.getByRole('combobox', { name: /resultat/i }).selectOption('HENLEGGELSE')
    await page.getByRole('radio', { name: /Bruker ønsker å trekke søknaden/i }).check()

    await page.getByRole('button', { name: /Opprett brev/i }).click()
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()
    await fyllPlaceholder(page, /Begrunn hvorfor saken skal henlegges\./i, 'Bruker har trukket søknaden sin.')
    await page.getByRole('button', { name: /^Rediger$/i }).waitFor({ state: 'visible', timeout: 10_000 })

    await page.getByRole('button', { name: /Lukk saken/i }).click()

    const modal = page.getByRole('dialog', { name: /Vil du lukke.*saken/i })
    await expect(modal).toBeVisible()
    await expect(page.getByRole('dialog', { name: /Mangler brev/i })).not.toBeVisible()
    await expect(modal.getByText(/Du er i ferd med å sende ut et brev til bruker/i)).toBeVisible()

    await modal.getByRole('button', { name: /^Lukk saken$/i }).click()
    await expect(modal).not.toBeVisible({ timeout: 10_000 })

    await expect(page.getByText('Henlagt').first()).toBeVisible()
    await expect(page.getByRole('combobox', { name: /resultat/i })).not.toBeVisible()
    await expect(page.getByText(/Brev lagt til utsending/i)).toBeVisible()
  })
})
