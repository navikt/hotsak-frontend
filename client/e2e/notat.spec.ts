import { expect, test } from '@playwright/test'

import { klikkFattVedtak, settBehandlingsresultat, åpneSak } from './helpers'

test.describe('Notater', () => {
  async function opprettNotatutkast(page: import('@playwright/test').Page) {
    await page.getByRole('button', { name: /notater/i }).click()
    await page.getByRole('radio', { name: /Forvaltningsnotat/i }).check()
    await page.getByRole('button', { name: /Opprett forvaltningsnotat/i }).click()

    const form = page.locator('form[name="forvaltningsnotat-form"]')
    await expect(form.getByRole('textbox', { name: /tittel/i })).toBeVisible({ timeout: 5_000 })
    await form.getByRole('textbox', { name: /tittel/i }).fill('Tittel på notat')
    await form.getByRole('textbox', { name: /editable markdown/i }).fill('Et test-notat')
    return form
  }

  test('kan opprette en kommentar', async ({ page }) => {
    await åpneSak(page)

    // Open notater panel via the pencil icon button
    await page.getByRole('button', { name: /notater/i }).click()

    // "Kommentar" is selected by default in the ToggleGroup
    const kommentarTextbox = page.getByRole('textbox', { name: /kommentar/i })
    await expect(kommentarTextbox).toBeVisible({ timeout: 5_000 })
    await kommentarTextbox.fill('En test-kommentar')

    await page.getByRole('button', { name: /Lagre kommentar/i }).click()

    // Verify the comment was saved (appears in the list)
    await expect(page.getByText('En test-kommentar')).toBeVisible({ timeout: 5_000 })
  })

  test('kan opprette et notatutkast', async ({ page }) => {
    await åpneSak(page)
    await opprettNotatutkast(page)

    await expect(page.getByTestId('utkast-lagret')).toBeVisible({ timeout: 5_000 })
  })

  test('kan slette et notatutkast', async ({ page }) => {
    await åpneSak(page)
    await opprettNotatutkast(page)

    await page.getByRole('button', { name: /Slett utkast/i }).click()
    const bekreftSlettDialog = page.getByRole('dialog', { name: /Er du sikker på at du vil slette utkastet/i })
    await expect(bekreftSlettDialog).toBeVisible()
    await bekreftSlettDialog.getByRole('button', { name: /Ja, slett utkastet/i }).click()

    await expect(page.getByRole('button', { name: /Opprett forvaltningsnotat/i })).toBeVisible()
  })

  test('kan ikke ferdigstille saken med notatutkast', async ({ page }) => {
    await åpneSak(page)
    const form = await opprettNotatutkast(page)
    await expect(page.getByTestId('utkast-lagret')).toBeVisible({ timeout: 5_000 })

    await settBehandlingsresultat(page, 'Innvilget')
    await klikkFattVedtak(page)

    const notatModal = page.getByRole('dialog', { name: /Notat ikke ferdigstilt/i })
    await expect(notatModal).toBeVisible()
    await notatModal.getByRole('button', { name: /lukk/i }).click()
    await expect(notatModal).not.toBeVisible()

    await form.getByRole('radio', { name: /Interne saksopplysninger/i }).check()
    await form.getByRole('button', { name: /Journalfør notat/i }).click()
    await expect(page.getByRole('button', { name: /Opprett forvaltningsnotat/i })).toBeVisible({ timeout: 5_000 })

    await klikkFattVedtak(page)
    const innvilgelsesModal = page
      .getByRole('dialog')
      .filter({ hasText: /Når du går videre blir det opprettet en serviceforespørsel/i })
    await expect(innvilgelsesModal).toBeVisible()
  })
})
