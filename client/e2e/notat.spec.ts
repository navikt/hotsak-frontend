import { expect, test } from '@playwright/test'

import { åpneSak } from './helpers'

test.describe('Notater', () => {
  test('kan opprette en kommentar', async ({ page }) => {
    await åpneSak(page)

    // Open notater panel via the pencil icon tab
    await page.getByRole('tab', { name: /notater/i }).click()

    // "Kommentar" is selected by default in the ToggleGroup
    const kommentarTextbox = page.getByRole('textbox', { name: /kommentar/i })
    await expect(kommentarTextbox).toBeVisible({ timeout: 5_000 })
    await kommentarTextbox.fill('En test-kommentar')

    await page.getByRole('button', { name: /Lagre kommentar/i }).click()

    // Verify the comment was saved (appears in the list)
    await expect(page.getByText('En test-kommentar')).toBeVisible({ timeout: 5_000 })
  })
})
