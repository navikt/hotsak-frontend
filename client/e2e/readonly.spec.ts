import { expect, test } from '@playwright/test'

import {
  fyllUtBegrunnelse,
  klikkFattVedtak,
  klikkGodkjennBegrunnelse,
  klikkGodkjennBeskjed,
  settBehandlingsresultat,
  åpneSak,
} from './helpers'

test.describe('Readonly etter ferdigstilling', () => {
  test('saken er readonly etter innvilgelse', async ({ page }) => {
    test.slow()
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')
    await klikkFattVedtak(page)

    const modal = page
      .getByRole('dialog')
      .filter({ hasText: /Når du går videre blir det opprettet en serviceforespørsel/i })
    await expect(modal).toBeVisible()

    const bekreftButton = modal.getByRole('button', { name: /^Innvilg$/i })
    await bekreftButton.click()

    await fyllUtBegrunnelse(page)
    await klikkGodkjennBegrunnelse(page)
    await klikkGodkjennBeskjed(page)
    await bekreftButton.click()

    await expect(modal).not.toBeVisible({ timeout: 10_000 })

    // Behandlingsutfall-label vises i sticky bunnlinje
    await expect(page.getByText('Innvilget').first()).toBeVisible()

    // Resultat-skjemaet er erstattet med lesevisning, ingen redigerbare felter igjen
    const behandlingspanel = page.getByRole('region', { name: /Behandlingspanel/i })
    await expect(behandlingspanel.getByRole('combobox', { name: /resultat/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /^Fatt vedtak$/i })).not.toBeVisible()
    await expect(behandlingspanel.getByRole('button', { name: /Opprett vedtaksbrev/i })).not.toBeVisible()
    await expect(behandlingspanel.getByRole('textbox')).toHaveCount(0)
    await expect(behandlingspanel.getByRole('radio')).toHaveCount(0)
  })

  test('saken er readonly etter henleggelse', async ({ page }) => {
    test.slow()
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

    // Behandlingsutfall-label vises i sticky bunnlinje
    await expect(page.getByText('Henlagt').first()).toBeVisible()

    // Resultat-skjemaet, radioknapper og knappene for å opprette brev/lukke saken skal ikke lenger være tilgjengelig
    const behandlingspanel = page.getByRole('region', { name: /Behandlingspanel/i })
    await expect(behandlingspanel.getByRole('combobox', { name: /resultat/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /^Lukk saken$/i })).not.toBeVisible()
    await expect(behandlingspanel.getByRole('button', { name: /Opprett brev/i })).not.toBeVisible()
    await expect(behandlingspanel.getByRole('radio')).toHaveCount(0)
    await expect(behandlingspanel.getByRole('textbox', { name: /Begrunn hvorfor saken lukkes/i })).not.toBeVisible()
  })
})
