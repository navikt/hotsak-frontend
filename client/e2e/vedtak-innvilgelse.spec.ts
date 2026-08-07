import { expect, test } from '@playwright/test'

import {
  fyllUtBegrunnelse,
  klikkFattVedtak,
  klikkGodkjennBegrunnelse,
  klikkGodkjennBeskjed,
  settBehandlingsresultat,
  åpneSak,
} from './helpers'

function finnInnvilgelsesModal(page: Parameters<typeof åpneSak>[0]) {
  return page.getByRole('dialog').filter({ hasText: /Når du går videre blir det opprettet en serviceforespørsel/i })
}

test.describe('Vedtak: Innvilgelse', () => {
  test('kan innvilge en søknad', async ({ page }) => {
    await åpneSak(page)

    // Set behandlingsresultat to Innvilget
    await settBehandlingsresultat(page, 'Innvilget')

    // Verify info message about optional brev
    await expect(page.getByText(/Du må selv vurdere om det er behov/i)).toBeVisible()

    // Click Fatt vedtak
    await klikkFattVedtak(page)

    // Verify FattVedtakModal opens
    const modal = finnInnvilgelsesModal(page)
    await expect(modal).toBeVisible()

    // Verify button text does NOT contain "send brev" (no brev created)
    await expect(modal.getByRole('button', { name: /^Innvilg$/i })).toBeVisible()
  })

  test.skip('kan innvilge en søknad med brev', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')

    // Create a brev (optional for innvilgelse)
    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()

    // Wait for brev panel to load and ferdigstill
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()

    // Now fatt vedtak
    await klikkFattVedtak(page)

    const modal = finnInnvilgelsesModal(page)
    await expect(modal).toBeVisible()

    // Button should say "Innvilg og send brev" since brev exists
    await expect(modal.getByRole('button', { name: /Innvilg og send brev/i })).toBeVisible()
  })

  test('submitter ikke før problemsammendrag er lastet i modalen', async ({ page }) => {
    let release!: () => void
    const gate = new Promise<void>((resolve) => (release = resolve))

    await page.route('**/api/sak/*/serviceforesporsel', async (route) => {
      await gate
      await route.continue()
    })

    let ferdigstillingCalls = 0
    page.on('request', (req) => {
      if (req.method() === 'POST' && req.url().includes('/behandling/') && req.url().includes('/ferdigstilling')) {
        ferdigstillingCalls++
      }
    })

    await åpneSak(page)
    await settBehandlingsresultat(page, 'Innvilget')
    await klikkFattVedtak(page)

    const modal = finnInnvilgelsesModal(page)
    await expect(modal).toBeVisible()

    await modal.getByRole('button', { name: /^Innvilg$/i }).click()
    await expect.poll(() => ferdigstillingCalls).toBe(0)

    release()

    await fyllUtBegrunnelse(page)
    await klikkGodkjennBegrunnelse(page)
    await klikkGodkjennBeskjed(page)

    const ferdigstillingRequest = page.waitForRequest(
      (r) => r.method() === 'POST' && r.url().includes('/behandling/') && r.url().includes('/ferdigstilling')
    )

    await modal.getByRole('button', { name: /^Innvilg$/i }).click()

    const body = (await ferdigstillingRequest).postDataJSON() as { problemsammendrag?: string }
    expect(body.problemsammendrag?.trim().length).toBeGreaterThan(0)
  })
})
